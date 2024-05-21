import { Event } from "../models";
import table, { RowType } from "../utils/model";
import { z } from "zod";

export type Reservation = RowType<typeof rsvs>;

const rsvs = table(
  "reservation",
  "id",
  z.object({
    id: z.number().optional(),
    pickup_time: z.date(),
    user_id: z.number().nullable(),
    post_id: z.number(),
  }),
);

export const clientFilter = (
  data: ({ id: number; pickup_time: Date; user_id: number | null } | undefined)[],
) => {
  return data
    .filter((data) => !!data)
    .map((data) => ({ id: data!.id, pickup_time: data!.pickup_time, free: !data!.user_id }));
};

export const create = (times: Date[], postId: number) => {
  return rsvs.queryMany(
    `
    INSERT INTO ${rsvs.name} (post_id, pickup_time)
    VALUES ${"(?, ?), ".repeat(times.length).slice(0, -2)}
    RETURNING *`,
    times.flatMap((time) => [postId, time]),
  );
};

export const byPost = (post_id: number) => rsvs.select().where({ post_id }).exec();

export const byPostForClient = async (post_id: number) => {
  return clientFilter(
    await rsvs.select(["id", "pickup_time", "user_id"]).where({ post_id }).exec(),
  );
};

export const find = (id: number) =>
  rsvs
    .select()
    .where({ id })
    .exec()
    .then((r) => r[0] as Reservation | undefined);

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
