import Event from "./Event";
import Post from "./Post";
import model from "./model";

export default class Reservation extends model("reservation", {
  id: "pkey",
  pickup_time: "datetime",
  user_id: "n_number",
  post_id: "number",
}) {
  private static must(data?: typeof Reservation.prototype.data) {
    if (!data) {
      // TODO
      throw new Error(`Validation failed for data: ${data}`);
    }

    return new Reservation(data);
  }

  static async create(time: Date, postId: number) {
    return Reservation.must(
      await Reservation.createRaw({ pickup_time: time, post_id: postId, user_id: null })
    );
  }

  static async byPost(postId: number) {
    const res = await Reservation.queryMany(`SELECT * from ${this.table} WHERE post_id = ?`, [
      postId,
    ]);
    return res.map(Reservation.must);
  }

  static async find(id: number) {
    const data = await Reservation.findBy("id", id);
    return data ? new Reservation(data) : undefined;
  }

  async reserve(userId: number) {
    if (this.data.user_id !== null) {
      return;
    }

    const post = await Post.find(this.data.post_id);
    if (!post) {
      return;
    }

    const data = Reservation.must(await this.updateRaw({ user_id: userId }));
    // TODO: create these together in one query
    await Event.create("reserved", post.data.user_id, userId, userId);
    await Event.create("reserved", post.data.user_id, post.data.user_id, userId);
    return data;
  }

  async cancel(userId: number) {
    const post = await Post.find(this.data.post_id);
    if (!post) {
      return;
    }

    // TODO: this validation code should go somewhere else
    if (post.data.id !== userId && this.data.user_id !== userId) {
      return;
    }

    const data = Reservation.must(await this.updateRaw({ user_id: null }));
    // TODO: create these together in one query
    await Event.create("cancelled", post.data.user_id, userId, userId);
    await Event.create("cancelled", post.data.user_id, post.data.user_id, userId);
    return data;
  }
}
