import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("images", (table) => {
    table.increments("id").primary();
    table.string("url", 255).notNullable();
    table.integer("post_id").notNullable();
    table.foreign("post_id").references("id").inTable("posts");
  });
}

export const down = (knex: Knex) => knex.schema.dropTable("images");
