import type { Knex } from "knex";

export const up = (knex: Knex) => {
  return knex.schema.alterTable("posts", (table) => {
    table.boolean("closed").notNullable().defaultTo(false);
  });
};

export const down = (knex: Knex) => {
  return knex.schema.alterTable("posts", (table) => {
    table.dropColumn("closed");
  });
};
