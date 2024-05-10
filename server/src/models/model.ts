import { Knex } from "knex";
import knex from "../db/knex";

/**
 * This type defines the types the model is capable of verifying, in the form <name>: <JS type>.
 * Some types correspond to the same JS type, but may have different validation requirements or
 * special purposes (ex. the 'pkey' type, of which there must be EXACTLY one in a schema).
 *
 * These types do not directly correspond to Postgres types. For example, the `timestamp` and
 * `datetime` entries will validate any date, the only difference is that `timestamp`s are not
 * required when calling `createRaw` or `updateRaw`.
 *
 * To add support for a new type to the model, add it to the type below, then add a validator that
 * can verify (and optionally transform) a value of an unknown type to the correct JS type.
 */
type DbTypes = {
  string: string;
  number: number;
  timestamp: Date;
  datetime: Date;
  pkey: number;

  n_number: number | null;
};

export type DbType = keyof DbTypes;

const validators = {
  string: (unk) => (typeof unk === "string" ? unk : undefined),
  number: (unk) => (typeof unk === "number" ? unk : undefined),
  pkey: (unk) => (typeof unk === "number" ? unk : undefined),
  timestamp: (unk) => (unk instanceof Date ? unk : undefined),
  datetime: (unk) => (unk instanceof Date ? unk : undefined),
  n_number: (unk) => (unk === null || typeof unk === "number" ? unk : undefined),
} satisfies Record<DbType, (_: unknown) => any>;

type RemoveNever<T> = {
  [K in { [K in keyof T]: T[K] extends never ? never : K }[keyof T]]: T[K];
};

/**
 * Half query helper/half validator, 100% worse than knex or drizzle.
 * @param table The Postgres table this model corresponds to
 * @param schema A schema describing the data types of the table. See `DbTypes` for more info.
 * @returns A class with helper functions for making queries against `table`
 */
export default function model<S extends Record<string, DbType>>(table: string, schema: S) {
  let primaryKey: string | undefined;
  for (const key in schema) {
    if (schema[key] === "pkey") {
      if (primaryKey) {
        throw new Error("Must have exactly one primary key");
      }
      primaryKey = key;
    }
  }

  if (!primaryKey) {
    throw new Error("Must have exactly one primary key");
  }

  type Data = { [P in keyof S]: DbTypes[S[P]] };
  type CreateData = RemoveNever<{
    [P in keyof S]: S[P] extends "pkey" | "timestamp" ? never : DbTypes[S[P]];
  }>;

  return class Model {
    static table: string = table;

    constructor(public data: Data) {}

    /**
     * Validate a row returned from a sql query against the schema
     * @returns data if validated correctly, undefined otherwise
     */
    static fromTableRow(rawRow: unknown) {
      if (typeof rawRow !== "object" || rawRow === null) {
        return;
      }

      const row = rawRow as Record<string, unknown>;
      for (const key in schema) {
        const result = validators[schema[key]](row[key]);
        if (result === undefined) {
          return;
        }

        row[key] = result;
      }

      return row as Data;
    }

    /** Make an arbitrary query expecting a single row back matching the schema. */
    static async queryOne(sql: string, binding: Knex.RawBinding) {
      const { rows } = await knex.raw(sql, binding);
      return Model.fromTableRow(rows[0]);
    }

    /** Make an arbitrary query expecting multiple rows back matching the schema. */
    static async queryMany(sql: string, binding: Knex.RawBinding) {
      const { rows } = await knex.raw(sql, binding);
      return (rows as unknown[]).map(Model.fromTableRow);
    }

    /** Get a list of all rows in the db */
    static async listRaw() {
      // TODO: pagination, limit

      // table is controlled by the server
      return Model.queryMany(`SELECT * FROM ${table}`, []);
    }

    /** Create an instance of this resource. Primary keys and timestamps are excluded by default */
    static async createRaw(data: CreateData) {
      // data keys are server controlled, sql injection doesn't matter here
      const values = Object.values(data);
      const query = `
            INSERT INTO ${table} (${Object.keys(data).join(", ")})
            VALUES (${"?, ".repeat(values.length).slice(0, -2)})
            RETURNING *`;
      return Model.queryOne(query, values);
    }

    /** Update this instance of this resource. Primary keys and timestamps are excluded by default */
    async updateRaw(data: Partial<CreateData>) {
      // data keys are server controlled, sql injection doesn't matter here
      const values = Object.values(data);
      const keys = Object.keys(data).map((key) => `${key}=?`);
      const query = `
              UPDATE ${table} SET ${keys.join(", ")}
              WHERE id=?
              RETURNING *`;
      values.push(this.data[primaryKey!]); // cant be undefined
      return Model.queryOne(query, values);
    }

    /** Find the first row for which `col` matches `value` */
    static async findBy<K extends keyof Data>(col: K, value: Data[K]) {
      return await Model.queryOne(`SELECT * FROM ${table} WHERE ${String(col)} = ?`, [value]);
    }

    /** Clear all entries in this table and reset the primary key sequence */
    static async deleteAll() {
      await knex(table).del();
      await knex.raw(`ALTER SEQUENCE ${table}_${primaryKey}_seq RESTART WITH 1`);
    }

    toJSON(): object {
      return this.data;
    }
  };
}