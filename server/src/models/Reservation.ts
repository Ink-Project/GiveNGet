import * as Event from "./Event";
import model, { RowType } from "../utils/model";

export type Reservation = RowType<typeof rsvs>;

const rsvs = model("reservation", {
  id: "pkey",
  pickup_time: "datetime",
  user_id: "n_number",
  post_id: "number",
});

export const create = (time: Date, postId: number) => {
  return rsvs.create({ pickup_time: time, post_id: postId, user_id: null });
};

export const byPost = (postId: number) => {
  return rsvs.queryMany(`SELECT * from ${rsvs.table} WHERE post_id = ?`, [postId]);
};

export const find = (id: number) => rsvs.findBy("id", id);

/** Reserve this time as user `userId`. */
export const select = async (self: Reservation, poster: number, userId: number) => {
  const data = await rsvs.update(self, { user_id: userId });
  if (!data) {
    return;
  }

  // TODO: create these together in one query
  await Event.create("reserved", data.post_id, userId, userId);
  await Event.create("reserved", data.post_id, poster, userId);
  return data;
};

/** Cancel the reservation as user `userId`. */
export const cancel = async (self: Reservation, poster: number, userId: number) => {
  const data = await rsvs.update(self, { user_id: null });
  if (!data) {
    return;
  }

  // TODO: create these together in one query
  await Event.create("cancelled", data.post_id, userId, userId);
  await Event.create("cancelled", data.post_id, poster, userId);
  return data;
};

export const deleteAll = () => rsvs.deleteAll();
