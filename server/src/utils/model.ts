/* eslint-disable no-unused-vars */
import { Knex } from "knex";
import { z } from "zod";
import knex from "../db/knex";

if (process.env.DB_VALIDATION) {
  console.log("zod DB validation is enabled");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RowType<M extends Model<any, any, any, any, any, any, any>> = Required<
  Parameters<M["update"]>[0]
>;

type Data<S extends z.ZodTypeAny> = Required<z.infer<S>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FromRowOutput<F extends (...args: any) => any, S extends z.ZodTypeAny> = F extends unknown
  ? Data<S>
  : ReturnType<F>;

export class Model<
  T extends z.ZodRawShape,
  U extends z.UnknownKeysParam,
  C extends z.ZodTypeAny,
  Output extends object,
  I extends object,
  S extends z.ZodObject<T, U, C, Output, I>,
  F extends (_data: Required<Output>) => unknown
> {
  readonly schema: ReturnType<S["required"]>;

  constructor(
    public readonly table: string,
    private readonly pkey: keyof Output,
    schema: S,
    private readonly transform?: F
  ) {
    // TODO: get rid of this
    // @ts-expect-error 2322
    this.schema = schema.required();
  }

  fromTableRowUnchecked(data: unknown) {
    return (this.transform && data ? this.transform(data as Data<S>) : data) as
      | FromRowOutput<F, S>
      | undefined;
  }

  fromTableRowSafe(data: unknown) {
    const res = this.schema.safeParse(data);
    if (res.success) {
      return this.fromTableRowUnchecked(res.data);
    } else {
      console.log("Row returned from database did not pass validation:", data);
      return;
    }
  }

  /**
   * Validate a row returned from a sql query against the schema
   * @returns data if validated correctly, undefined otherwise
   */
  fromTableRow =
    process.env.DB_VALIDATION === "development" ? this.fromTableRowSafe : this.fromTableRowUnchecked;

  /** Send a raw query to the database and return the rows */
  async raw(sql: string, binding: Knex.RawBinding) {
    const { rows } = await knex.raw(sql, binding);
    return rows as unknown[];
  }

  /** Make an arbitrary query expecting a single row back matching the schema. */
  async queryOne(sql: string, binding: Knex.RawBinding) {
    return this.fromTableRow((await this.raw(sql, binding))[0]);
  }

  /** Make an arbitrary query expecting multiple rows back matching the schema. */
  async queryMany(sql: string, binding: Knex.RawBinding) {
    return (await this.raw(sql, binding)).map((r) => this.fromTableRow(r));
  }

  /** Get a list of all rows in the db */
  async list() {
    // TODO: pagination, limit

    // table is controlled by the server
    return this.queryMany(`SELECT * FROM ${this.table}`, []);
  }

  /** Create an instance of this resource. */
  async create(data: Output) {
    // data keys are server controlled, sql injection doesn't matter here
    const values = Object.values(data);
    const query = `
            INSERT INTO ${this.table} (${Object.keys(data).join(", ")})
            VALUES (${"?, ".repeat(values.length).slice(0, -2)})
            RETURNING *`;
    return this.queryOne(query, values);
  }

  /** Update this instance of this resource. */
  async update(self: Data<S>, data: Partial<Output>) {
    // data keys are server controlled, sql injection doesn't matter here
    const values = Object.values(data);
    const keys = Object.keys(data).map((key) => `${key}=?`);
    values.push(self[this.pkey]); // cant be undefined
    return this.queryOne(
      `UPDATE ${this.table} SET ${keys.join(", ")} WHERE id=? RETURNING *`,
      values
    );
  }

  /** Find the first row for which `col` matches `value` */
  async findBy<K extends keyof Data<S>>(col: K, value: Data<S>[K]) {
    return await this.queryOne(`SELECT * FROM ${this.table} WHERE ${String(col)} = ?`, [value]);
  }

  /** Clear all entries in this table and reset the primary key sequence */
  async deleteAll() {
    await knex(this.table).del();
    await knex.raw(`ALTER SEQUENCE ${this.table}_${String(this.pkey)}_seq RESTART WITH 1`);
  }
}

/**
 * @param table The Postgres table this model corresponds to
 * @param schema A zod schema describing the data types of the table. Optional fields are REQUIRED
 * in the returned rows, but are optional when creating or updating a row.
 * @returns An object with helper functions for making queries against `table`
 */
export default function model<
  T extends z.ZodRawShape,
  U extends z.UnknownKeysParam,
  C extends z.ZodTypeAny,
  O extends object,
  I extends object,
  S extends z.ZodObject<T, U, C, O, I>,
  F extends (_data: Required<O>) => unknown
>(table: string, pkey: keyof z.infer<S>, schema: S, transform?: F) {
  return new Model(table, pkey, schema, transform);
}
