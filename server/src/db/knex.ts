import knexfile from "../../knexfile";
import knex from "knex";

export default knex(knexfile[process.env.NODE_ENV === "production" ? "production" : "development"]);
