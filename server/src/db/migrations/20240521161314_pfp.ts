import type { Knex } from "knex";

export const up = (knex: Knex) => {
  return knex.schema.alterTable("users", (table) => {
    table.string("profile_image", 255).nullable().defaultTo(null);
    table.string("full_name", 255).notNullable().defaultTo("");
  });
};

export const down = (knex: Knex) => {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("profile_image");
    table.dropColumn("full_name");
  });
};
