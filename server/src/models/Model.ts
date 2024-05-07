import { Knex } from "knex";
import knex from "../knex";

type MarshalTypes = {
  string: string;
  number: number;
  timestamp: Date;
  datetime: Date;
  pkey: number;
};

export type MarshalAs = keyof MarshalTypes;

const validators = {
  string: (unk: unknown) => (typeof unk === "string" ? unk : undefined),
  number: (unk: unknown) => (typeof unk === "number" ? unk : undefined),
  pkey: (unk: unknown) => (typeof unk === "number" ? unk : undefined),
  timestamp: (unk: unknown) => (unk instanceof Date ? unk : undefined),
  datetime: (unk: unknown) => (unk instanceof Date ? unk : undefined),
} satisfies Record<MarshalAs, any>;

type RemoveNever<T> = {
  [K in { [K in keyof T]: T[K] extends never ? never : K }[keyof T]]: T[K];
};

export default function model<S extends Record<string, MarshalAs>>(table: string, schema: S) {
  let primaryKey: string | undefined = undefined;
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

  type Data = { [P in keyof S]: MarshalTypes[S[P]] };
  type CreateData = RemoveNever<{
    [P in keyof S]: S[P] extends "pkey" | "timestamp" ? never : MarshalTypes[S[P]];
  }>;

  return class Model {
    static table: string = table;

    constructor(public data: Data) {}

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

    static async queryOne(sql: string, binding: Knex.RawBinding) {
      const { rows } = await knex.raw(sql, binding);
      return Model.fromTableRow(rows[0]);
    }

    static async queryMany(sql: string, binding: Knex.RawBinding) {
      const { rows } = await knex.raw(sql, binding);
      return (rows as unknown[]).map(Model.fromTableRow);
    }

    static async listRaw() {
      // table is controlled by the server
      return Model.queryMany(`SELECT * FROM ${table}`, []);
    }

    static async createRaw(data: CreateData) {
      // data keys are server controlled, sql injection doesn't matter here
      const values = Object.values(data);
      const query = `
            INSERT INTO ${table} (${Object.keys(data).join(", ")})
            VALUES (${"?, ".repeat(values.length).slice(0, -2)})
            RETURNING *`;
      return Model.queryOne(query, values);
    }

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

    static async findBy<K extends keyof Data>(row: K, value: Data[K]) {
      return await Model.queryOne(`SELECT * FROM ${table} WHERE ${String(row)} = ?`, [value]);
    }

    static async deleteAll() {
      return knex(table).del();
    }
  };
}
