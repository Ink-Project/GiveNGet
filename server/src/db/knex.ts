import knexfile from "../../knexfile";
import knex from "knex";
import { IS_PRODUCTION } from "../utils";

export default knex(knexfile[IS_PRODUCTION ? "production" : "development"]);
