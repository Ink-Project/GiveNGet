import type { Knex } from "knex";

export const up = (knex: Knex) => {
  return knex.schema.alterTable("event_log", (table) => {
    table.integer("user_id").notNullable();
  });
};

export const down = (knex: Knex) => {
  return knex.schema.alterTable("event_log", (table) => {
    table.dropColumn("user_id");
  });
};
