import User from "../models/User";
import { Knex } from "knex";

export const seed = async (knex: Knex) => {
  // Before you have models you can always just do `await knex('table_name').del`
  await knex("users").del();

  await knex.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");

  await User.create("cool_cat", "1234");
  await User.create("l33t-guy", "1234");
  await User.create("wowow", "1234");
};
