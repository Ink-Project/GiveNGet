import Post from "./Post";
import model from "./model";

export default class Image extends model("images", {
  id: "pkey",
  url: "string",
  post_id: "number",
}) {
  static async create(url: string, post: Post) {
    return this.createRaw({ url, post_id: post.data.id });
  }

  static async findAllPostImages(post: Post) {
    return this.queryMany(`SELECT * from ${this.table} WHERE id = ?`, post.data.id);
  }
}
