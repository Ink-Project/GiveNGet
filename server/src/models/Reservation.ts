import * as Event from "./Event";
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

  /** Reserve this time as user `userId`. */
  async select(userId: number) {
    const data = Reservation.must(await this.updateRaw({ user_id: userId }));
    // TODO: create these together in one query
    await Event.create("reserved", this.data.post_id, userId, userId);
    await Event.create("reserved", this.data.post_id, this.data.post_id, userId);
    return data;
  }

  /** Cancel the reservation as user userId. */
  async cancel(poster: number, actor: number) {
    const data = Reservation.must(await this.updateRaw({ user_id: null }));
    // TODO: create these together in one query
    await Event.create("cancelled", this.data.post_id, this.data.user_id!, actor);
    await Event.create("cancelled", this.data.post_id, poster, actor);
    return data;
  }
}