import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("event_log", (table) => {
    table.increments("id").primary();
    table.enum("event", ["reserved", "created", "cancelled"]);
    table.integer("actor_id").notNullable();
    table.foreign("actor_id").references("id").inTable("users");
    table.integer("post_id").notNullable();
    table.foreign("post_id").references("id").inTable("posts");
    table.timestamps(true, true);
  });
}

export const down = (knex: Knex) => knex.schema.dropTable("event_log");
