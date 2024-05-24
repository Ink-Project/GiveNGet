import knexfile from "../../knexfile";
import knex from "knex";
import { IS_PRODUCTION } from "../utils";

const config = IS_PRODUCTION ? "production" : "development";
console.log("using config:", config);
export default knex(knexfile[config]);
