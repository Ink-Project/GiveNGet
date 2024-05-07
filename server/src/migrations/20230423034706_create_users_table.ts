import { Knex } from "knex";

export const up = (knex: Knex) => {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.string("username").notNullable().unique();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });
};

export const down = (knex: Knex) => knex.schema.dropTable("users");
