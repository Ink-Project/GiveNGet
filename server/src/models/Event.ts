import model from "../utils/model";
import { z } from "zod";

export const EVENT_TYPES = ["reserved", "cancelled"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

const events = model(
  "event_log",
  "id",
  z.object({
    id: z.number().optional(),
    event: z.enum(EVENT_TYPES),
    user_id: z.number(),
    actor_id: z.number(),
    post_id: z.number(),
    created_at: z.date().optional(),
  }),
);

/**
 * @param userId The ID for the user this event is relevant to
 * @param actorId The ID of the user that initiated this event, ex. for a cancel event, this is
 * the user that initiated the cancel.
 */
export const create = (event: EventType, postId: number, userId: number, actorId: number) => {
  return events.create({ event, post_id: postId, user_id: userId, actor_id: actorId });
};

/** Get all relevant events for a user in chronological order */
export const inboxFor = (user_id: number) => {
  return events.select().where({ user_id }).orderBy("created_at", "asc").exec();
};

export const deleteAll = () => events.deleteAll();
