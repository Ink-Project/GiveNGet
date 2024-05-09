import model from "./model";
import Reservation from "./Reservation";

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
      throw new Error(`Validation failed for data: ${data}`);
    }

    return new Post(data);
  }

  /**
   * @param images Must be the URLs to the images on our server, not the urls/blobs given by the user
   */
  static async create(
    creatorId: number,
    title: string,
    description: string,
    location: string,
    images: string[],
    pickup_times: Date[]
  ) {
    const post = Post.must(
      await Post.createRaw({
        title,
        description,
        location,
        user_id: creatorId,
      })
    );

    // TODO: use one query to add all at the same time
    for (const image of images) {
      Image.create(image, post.data.id);
    }

    for (const time of pickup_times) {
      Reservation.create(time, post.data.id);
    }

    return post;
  }

  static async list() {
    return (await Post.listRaw()).map(Post.must);
  }

  static async find(id: number) {
    const data = await Post.findBy("id", id);
    return data ? new Post(data) : undefined;
  }

  async update(title: string, description: string, location: string) {
    return Post.must(await this.updateRaw({ title, description, location }));
  }

  static async deleteAll() {
    await Image.deleteAll();
    await super.deleteAll();
  }
}

namespace Image {
  class Image extends model("images", {
    id: "pkey",
    url: "string",
    post_id: "number",
  }) {}

  export function create(url: string, postId: number) {
    return Image.createRaw({ url, post_id: postId });
  }

  export function findAllPostImages(postId: number) {
    return Image.queryMany(`SELECT * from ${Image.table} WHERE post_id = ?`, postId);
  }

  export function deleteAll() {
    return Image.deleteAll();
  }
}
