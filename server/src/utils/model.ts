/* eslint-disable no-unused-vars */
import { Knex } from "knex";
import { z } from "zod";
import knex from "../db/knex";

if (process.env.DB_VALIDATION) {
  console.log("zod DB validation is enabled");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RowType<M extends Table<any, any, any, any, any, any, any>> = Required<
  Parameters<M["update"]>[0]
>;

type Data<S extends z.ZodTypeAny> = Required<z.infer<S>>;

abstract class Query<
  T extends z.ZodRawShape,
  U extends z.UnknownKeysParam,
  C extends z.ZodTypeAny,
  O extends object,
  I extends object,
  S extends z.ZodObject<T, U, C, O, I>,
  F extends (_data: Partial<O>) => unknown,
> {
  constructor(protected model: Table<T, U, C, O, I, S, F>) {}

  abstract exec(): Promise<unknown>;
}

class Select<
  T extends z.ZodRawShape,
  U extends z.UnknownKeysParam,
  C extends z.ZodTypeAny,
  O extends object,
  I extends object,
  S extends z.ZodObject<T, U, C, O, I>,
  F extends (_data: Partial<O>) => unknown,
  P extends (keyof O)[] | undefined,
> extends Query<T, U, C, O, I, S, F> {
  private qwhere: { [K in keyof O]?: Comparator<O[K]> } = {};
  private qlimit?: number;
  private qoffset?: number;
  private qorderBy?: [keyof O, "asc" | "desc"];

  constructor(model: Table<T, U, C, O, I, S, F>, private keys: P) {
    super(model);
  }

  where(items: { [K in keyof O]?: Comparator<O[K]> }) {
    this.qwhere = items;
    return this;
  }

  limit(limit?: number) {
    this.qlimit = limit;
    return this;
  }

  offset(offset?: number) {
    this.qoffset = offset;
    return this;
  }

  orderBy(key: keyof O, order: "asc" | "desc") {
    this.qorderBy = [key, order];
    return this;
  }

  exec() {
    type Row = P extends undefined ? Data<S> : Pick<Data<S>, NonNullable<P>[number]>;

    let query = `SELECT ${this.keys ? this.keys.join(", ") : "*"} from ${this.model.name}`;
    let i = 0;
    const values = [];
    for (const k in this.qwhere) {
      const cmp = this.qwhere[k];
      if (!cmp) {
        continue;
      } else if (!i) {
        query += " WHERE ";
      } else {
        query += " AND ";
      }

      // objects don't make sense in queries
      if (typeof cmp === "object") {
        // @ts-expect-error 2339
        query += cmp.query(k);
        // @ts-expect-error 2339
        values.push(cmp.value);
      } else {
        query += `${k} = ?`;
        values.push(cmp);
      }
      i++;
    }

    if (this.qorderBy) {
      query += ` ORDER BY ${String(this.qorderBy[0])} ${
        this.qorderBy[1] === "desc" ? "DESC" : "ASC"
      }`;
    }
    if (this.qlimit) {
      query += " LIMIT ?";
      values.push(this.qlimit);
    }
    if (this.qoffset) {
      query += " OFFSET ?";
      values.push(this.qoffset);
    }

    return this.model.queryMany(query, values) as Promise<Row[]>;
  }
}

export class Table<
  T extends z.ZodRawShape,
  U extends z.UnknownKeysParam,
  C extends z.ZodTypeAny,
  O extends object,
  I extends object,
  S extends z.ZodObject<T, U, C, O, I>,
  F extends (_data: Partial<O>) => unknown,
> {
  readonly schema: ReturnType<S["required"]>;

  constructor(
    public readonly name: string,
    private readonly pkey: keyof O,
    schema: S,
    private readonly transform?: F,
  ) {
    // TODO: get rid of this
    // @ts-expect-error 2322
    this.schema = schema.required();
  }

  fromRowUnchecked(data: unknown) {
    return (this.transform && data ? this.transform(data as Data<S>) : data) as
      | (F extends unknown ? Data<S> : ReturnType<F>)
      | undefined;
  }

  fromRowSafe(data: unknown) {
    const res = this.schema.safeParse(data);
    if (res.success) {
      return this.fromRowUnchecked(res.data);
    } else {
      console.log("Row returned from database did not pass validation:", data);
      return;
    }
  }

  /**
   * Validate a row returned from a sql query against the schema
   * @returns data if validated correctly, undefined otherwise
   */
  fromRow = process.env.DB_VALIDATION ? this.fromRowSafe : this.fromRowUnchecked;

  /** Send a raw query to the database and return the rows */
  async raw(sql: string, binding: Knex.RawBinding) {
    const { rows } = await knex.raw(sql, binding);
    return rows as unknown[];
  }

  /** Make an arbitrary query expecting a single row back matching the schema. */
  async queryOne(sql: string, binding: Knex.RawBinding) {
    return this.fromRow((await this.raw(sql, binding))[0]);
  }

  /** Make an arbitrary query expecting multiple rows back matching the schema. */
  async queryMany(sql: string, binding: Knex.RawBinding) {
    return (await this.raw(sql, binding)).map((r) => this.fromRow(r));
  }

  /** Create an instance of this resource. */
  async create(data: O) {
    // data keys are server controlled, sql injection doesn't matter here
    const values = Object.values(data);
    const query = `
            INSERT INTO ${this.name} (${Object.keys(data).join(", ")})
            VALUES (${"?, ".repeat(values.length).slice(0, -2)})
            RETURNING *`;
    return this.queryOne(query, values);
  }

  /** Update this instance of this resource. */
  async update(self: Data<S>, data: Partial<O>) {
    // data keys are server controlled, sql injection doesn't matter here
    const values = Object.values(data);
    if (!values.length) {
      return self;
    }

    const keys = Object.keys(data).map((key) => `${key}=?`);
    values.push(self[this.pkey]); // cant be undefined
    return this.queryOne(
      `UPDATE ${this.name} SET ${keys.join(", ")} WHERE id=? RETURNING *`,
      values,
    );
  }

  select<P extends (keyof Data<S>)[] | undefined>(keys?: P) {
    return new Select(this, keys);
  }

  /** Clear all entries in this table and reset the primary key sequence */
  async deleteAll() {
    await knex(this.name).del();
    await knex.raw(`ALTER SEQUENCE ${this.name}_${String(this.pkey)}_seq RESTART WITH 1`);
  }
}

type ComparatorObj<T> = {
  value: T;
  query(key: string): string;
};
type Comparator<T> = T | ComparatorObj<T>;

export const m = {
  like: <T>(value: T) => ({
    query: (key) => `${key} LIKE ?`,
    value,
  }),
  likeInsensitive: <T>(value: T) => ({
    query: (key) => `lower(${key}) LIKE lower(?)`,
    value,
  }),
} satisfies Record<string, (_: unknown) => ComparatorObj<unknown>>;

/**
 * @param name The DB table this model corresponds to
 * @param schema A zod schema describing the data types of the table. Optional fields are REQUIRED
 * in the returned rows, but are optional when creating or updating a row.
 * @returns An object with helper functions for making queries against `table`
 */
export default function table<
  T extends z.ZodRawShape,
  U extends z.UnknownKeysParam,
  C extends z.ZodTypeAny,
  O extends object,
  I extends object,
  S extends z.ZodObject<T, U, C, O, I>,
  F extends (_data: Partial<O>) => unknown,
>(name: string, pkey: keyof z.infer<S>, schema: S, transform?: F) {
  return new Table(name, pkey, schema, transform);
}
