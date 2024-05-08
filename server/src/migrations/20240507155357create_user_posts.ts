import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("posts", (table) => {
    table.increments("id").primary();
    table.string("title", 255).notNullable();
    table.string("description", 255).notNullable();
    table.string("location", 255).notNullable();
    table.integer("user_id").notNullable();
    table.foreign('user_id').references("id").inTable("users");
    table.timestamps(true, true);
  });
}

export const down = (knex: Knex) => knex.schema.dropTable("posts");
