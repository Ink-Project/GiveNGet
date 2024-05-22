import table from "../utils/model";
import { z } from "zod";

export const EVENT_TYPES = ["reserved", "cancelled"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const events = table(
  "event_log",
  "id",
  z.object({
    id: z.number().optional(),
    event: z.enum(EVENT_TYPES),
    // The ID for the user this event is relevant to
    user_id: z.number(),
    // The ID of the user that initiated this event, ex. for a cancel event, this is the user that
    // initiated the cancel.
    actor_id: z.number(),
    post_id: z.number(),
    created_at: z.date().optional(),
  }),
);

/** Get all relevant events for a user in chronological order */
export const inboxFor = (user_id: number) => {
  return events.select().where({ user_id }).orderBy("created_at", "asc").exec();
};

export const deleteAll = () => events.deleteAll();
