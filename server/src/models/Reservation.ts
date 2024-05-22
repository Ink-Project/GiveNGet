import table, { RowType } from "../utils/model";
import { z } from "zod";
import { events } from "./Event";

export type Reservation = RowType<typeof rsvs>;

export const rsvs = table(
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

export const create = (times: Date[], post_id: number) => {
  return rsvs
    .insert(["post_id", "pickup_time"])
    .values(times.map((pickup_time) => ({ post_id, pickup_time })))
    .returning()
    .exec();
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

  await events
    .insert()
    .values([
      { event: "reserved", post_id: data.post_id, user_id: userId, actor_id: userId },
      { event: "reserved", post_id: data.post_id, user_id: poster, actor_id: userId },
    ])
    .exec();
  return data;
};

/** Cancel the reservation as user `userId`. */
export const cancel = async (self: Reservation, poster: number, userId: number) => {
  const data = await rsvs.update(self, { user_id: null });
  if (!data) {
    return;
  }

  await events
    .insert()
    .values([
      { event: "cancelled", post_id: data.post_id, user_id: userId, actor_id: userId },
      { event: "cancelled", post_id: data.post_id, user_id: poster, actor_id: userId },
    ])
    .exec();
  return data;
};

export const deleteAll = () => rsvs.deleteAll();
