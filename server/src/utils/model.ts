import { Knex } from "knex";
import knex from "../db/knex";
import createValidator, { VType, VTypeMap } from "./validator";

type RemoveNever<T> = {
  [K in { [K in keyof T]: T[K] extends never ? never : K }[keyof T]]: T[K];
};

type DataFor<S extends Record<string, VType>> = { [P in keyof S]: VTypeMap[S[P]] };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RowType<T extends Record<string, any>> = Exclude<
  ReturnType<T["fromTableRow"]>,
  undefined
>;

/**
 * @param table The Postgres table this model corresponds to
 * @param schema A schema describing the data types of the table. See `VTypeMap` for more info.
 * @returns A class with helper functions for making queries against `table`
 */
export default function model<S extends Record<string, VType>, T>(
  table: string,
  schema: S,
  transform?: (_data: DataFor<S>) => T
) {
  type FromRowOutput = T extends unknown ? DataFor<S> : T;
  type Data = DataFor<S>;
  type CreateData = RemoveNever<{
    [P in keyof S]: S[P] extends "pkey" | "timestamp" ? never : VTypeMap[S[P]];
  }>;

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

  const validate = createValidator(schema);

  return {
    table,

    /**
     * Validate a row returned from a sql query against the schema
     * @returns data if validated correctly, undefined otherwise
     */
    fromTableRow(row: unknown): FromRowOutput | undefined {
      const data = validate(row);
      return (transform && data ? transform(data) : data) as FromRowOutput | undefined;
    },

    async raw(sql: string, binding: Knex.RawBinding) {
      const { rows } = await knex.raw(sql, binding);
      return rows as unknown[];
    },

    /** Make an arbitrary query expecting a single row back matching the schema. */
    async queryOne(sql: string, binding: Knex.RawBinding) {
      return this.fromTableRow((await this.raw(sql, binding))[0]);
    },

    /** Make an arbitrary query expecting multiple rows back matching the schema. */
    async queryMany(sql: string, binding: Knex.RawBinding) {
      return (await this.raw(sql, binding)).map((r) => this.fromTableRow(r));
    },

    /** Get a list of all rows in the db */
    async list() {
      // TODO: pagination, limit

      // table is controlled by the server
      return this.queryMany(`SELECT * FROM ${table}`, []);
    },

    /** Create an instance of this resource. Primary keys and timestamps are excluded by default */
    async create(data: CreateData) {
      // data keys are server controlled, sql injection doesn't matter here
      const values = Object.values(data);
      const query = `
            INSERT INTO ${table} (${Object.keys(data).join(", ")})
            VALUES (${"?, ".repeat(values.length).slice(0, -2)})
            RETURNING *`;
      return this.queryOne(query, values);
    },

    /** Update this instance of this resource. Primary keys and timestamps are excluded by default */
    async update(self: Data, data: Partial<CreateData>) {
      // data keys are server controlled, sql injection doesn't matter here
      const values = Object.values(data);
      const keys = Object.keys(data).map((key) => `${key}=?`);
      values.push(self[primaryKey!]); // cant be undefined
      return this.queryOne(`UPDATE ${table} SET ${keys.join(", ")} WHERE id=? RETURNING *`, values);
    },

    /** Find the first row for which `col` matches `value` */
    async findBy<K extends keyof Data>(col: K, value: Data[K]) {
      return await this.queryOne(`SELECT * FROM ${table} WHERE ${String(col)} = ?`, [value]);
    },

    /** Clear all entries in this table and reset the primary key sequence */
    async deleteAll() {
      await knex(table).del();
      await knex.raw(`ALTER SEQUENCE ${table}_${primaryKey}_seq RESTART WITH 1`);
    },
  };
}