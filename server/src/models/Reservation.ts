import { Event } from "../models";
import model, { RowType } from "../utils/model";
import { z } from "zod";

export type Reservation = RowType<typeof rsvs>;

const rsvs = model("reservation", {
  id: "pkey",
  pickup_time: "datetime",
  user_id: "n_number",
  post_id: "number",
});

const post = z.object({
  id: z.number(),
  pickup_time: z.date(),
  user_id: z.number().nullable(),
});

export const clientFilter = (data: (z.infer<typeof post> | undefined)[]) => {
  return data
    .filter((data) => !!data)
    .map((data) => ({ id: data!.id, pickup_time: data!.pickup_time, free: !data!.user_id }));
};

export const create = (times: Date[], postId: number) => {
  return rsvs.queryMany(
    `
    INSERT INTO ${rsvs.table} (post_id, pickup_time)
    VALUES ${"(?, ?), ".repeat(times.length).slice(0, -2)}
    RETURNING *`,
    times.flatMap((time) => [postId, time])
  );
};

export const byPost = (postId: number) => {
  return rsvs.queryMany(`SELECT * from ${rsvs.table} WHERE post_id = ?`, [postId]);
};

export const byPostForClient = async (postId: number) => {
  const rows = await rsvs.raw(
    `SELECT id, pickup_time, user_id from ${rsvs.table} WHERE post_id = ?`,
    [postId]
  );
  return clientFilter(rows.map(r => post.safeParse(r).data));
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
