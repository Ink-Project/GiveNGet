import knex from "../knex";
import model from "./Model";
import User from "./User";

export default class Post extends model("posts", {
  id: "pkey",
  title: "string",
  description: "string",
  location: "string",
  user_id: "number",
  created_at: "timestamp",
  updated_at: "timestamp",
}) {
  private static must(data?: typeof Post.prototype.data) {
    if (!data) {
      // TODO
      throw new Error(`Validation failed for data: ${data}}`);
    }

    return new Post(data);
  }

  /**
   * @param images Must be the URLs to the images on our server, not the urls/blobs given by the user
   */
  static async create(
    creator: User,
    title: string,
    description: string,
    location: string,
    images: string[]
  ) {
    const post = Post.must(
      await Post.createRaw({
        title,
        description,
        location,
        user_id: creator.data.id,
      })
    );

    for (const image of images) {
      await knex.raw("INSERT INTO images (url, post_id) VALUES (?, ?)", [image, post.data.id]);
    }
    return post;
  }

  static async list() {
    return (await Post.listRaw()).map(Post.must);
  }

  static async find(id: number) {
    const data = await Post.findBy("id", id);
    return data ? Post.must(data) : undefined;
  }

  async update(title: string, description: string, location: string) {
    return Post.must(await this.updateRaw({ title, description, location }));
  }
}