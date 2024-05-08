import knexfile from "../knexfile";
import knex from "knex";

const environment = () => {
  let env = process.env.NODE_ENV;
  if (env !== "development" && env !== "production") {
    env = "development";
  }
  return env as "production" | "development";
};

export default knex(knexfile[environment()]);
