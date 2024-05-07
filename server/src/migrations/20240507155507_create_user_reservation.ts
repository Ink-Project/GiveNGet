import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('reservation', (table) => {
    table.increments('id').primary();
    table.dateTime('pickup_time').notNullable();
    table.integer("user_id").nullable();
    table.foreign('user_id').references('id').inTable('users');
    table.integer("post_id").notNullable();
    table.foreign('post_id').references('id').inTable('posts');
  })
}


export const down = (knex: Knex) => knex.schema.dropTable("reservation");

