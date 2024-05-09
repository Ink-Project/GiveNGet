import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("event_log", (table) => {
    table.integer("user_id").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("event_log", (table) => {
    table.dropColumn("user_id");
  });
}
