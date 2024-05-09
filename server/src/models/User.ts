import { isValidPassword, hashPassword } from "../utils/auth";
import model from "./model";

export default class User extends model("users", {
  id: "pkey",
  username: "string",
  password: "string",
  created_at: "timestamp",
  updated_at: "timestamp",
}) {
  async isValidPassword(plaintext: string) {
    return isValidPassword(plaintext, this.data.password);
  }

  private static must(data?: typeof User.prototype.data) {
    if (!data) {
      // TODO
      throw new Error(`Validation failed for data: ${data}`);
    }

    return new User(data);
  }

  static async list() {
    return (await User.listRaw()).map(User.must);
  }

  static async find(id: number) {
    const data = await User.findBy("id", id);
    return data ? new User(data) : undefined;
  }

  static async findByUsername(username: string) {
    const data = await User.findBy("username", username);
    return data ? new User(data) : undefined;
  }

  static async create(username: string, password: string) {
    const hashed = await hashPassword(password);
    if (!hashed) {
      return;
    }
    return User.must(await User.createRaw({ username, password: hashed }));
  }

  async update(username: string) {
    return User.must(await this.updateRaw({ username }));
  }

  toJSON() {
    return JSON.stringify(this.data, (key, value) =>
      key === "password" || key === "updated_at" ? undefined : value
    );
  }
}
