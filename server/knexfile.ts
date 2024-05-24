import dotenv from "dotenv";
import path from "path";
import { Knex } from "knex";

dotenv.config();

if (process.env.IN_DEPLOY) {
  process.env.NODE_ENV = "production";
}

/*
We'll use environment variables to set the Postgres username and password
so we don't share that information online.

When we deploy in "production", we'll provide a PG_CONNECTION_STRING
*/

const common = {
  client: "pg",
  migrations: {
    directory: path.join(__dirname, "src/db/migrations"),
  } satisfies Knex.MigratorConfig,
  seeds: {
    directory: path.join(__dirname, "src/db/seeds"),
  } satisfies Knex.SeederConfig,
};

export default {
  development: {
    connection: {
      host: process.env.PG_HOST || "127.0.0.1",
      port: Number(process.env.PG_PORT || "5432"),
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASS || "postgres",
      database: process.env.PG_DB || "postgres",
    },
    ...common,
  },
  production: {
    connection: process.env.PG_CONNECTION_STRING,
    ...common,
  },
} satisfies { development: Knex.Config; production: Knex.Config };
