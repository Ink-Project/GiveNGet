import knex from "../knex";
import { isValidPassword, hashPassword } from "../utils/auth";

export default class User {
  #password: string;

  private constructor(
    public id: number,
    public username: string,
    password: string,
  ) {
    this.id = id;
    this.username = username;
    this.#password = password;
  }

  private static fromUnknown(obj: unknown) {
    try {
      const { id, username, password } = obj as any;
      if (typeof id !== "number" || typeof username !== "string" || typeof password !== "string") {
        throw new Error();
      }
      return new User(id, username, password);
    } catch (_) {
      console.warn(`Bad record in database: ${obj}`);
    }
  }

  async isValidPassword(plaintext: string) {
    return isValidPassword(plaintext, this.#password);
  }

  static async list() {
    const { rows } = await knex.raw("SELECT * FROM users");
    return (rows as unknown[]).map((user) => User.fromUnknown(user));
  }

  static async find(id: number) {
    const query = "SELECT * FROM users WHERE id = ?";
    const { rows } = await knex.raw(query, [id]);
    return User.fromUnknown(rows[0]);
  }

  static async findByUsername(username: string) {
    const query = "SELECT * FROM users WHERE username = ?";
    const { rows } = await knex.raw(query, [username]);
    return User.fromUnknown(rows[0]);
  }

  static async create(username: string, password: string) {
    const hash = await hashPassword(password);
    const query = "INSERT INTO users (username, password) VALUES (?, ?) RETURNING *";
    const { rows } = await knex.raw(query, [username, hash]);
    return User.fromUnknown(rows[0]);
  }

  static async update(id: number, username: string) {
    const query = "UPDATE users SET username=? WHERE id=? RETURNING *";
    const { rows } = await knex.raw(query, [username, id]);
    return User.fromUnknown(rows[0]);
  }

  static async deleteAll() {
    return knex("users").del();
  }
}
