import model from "../../models/model";
export const EVENT_TYPES = ["reserved", "cancelled"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

const Event = model("event_log", {
  id: "pkey",
  event: "string",
  user_id: "number",
  actor_id: "number",
  post_id: "number",
  created_at: "timestamp",
});

/**
 * @param userId The ID for the user this event is relevant to
 * @param actorId The ID of the user that initiated this event, ex. for a cancel event, this is
 * the user that initiated the cancel.
 */
export function create(event: EventType, postId: number, userId: number, actorId: number) {
  return Event.createRaw({ event, post_id: postId, user_id: userId, actor_id: actorId });
}

/** Get all relevant events for a user in chronological order */
export function inboxFor(userId: number) {
  return Event.queryMany(
    `
      SELECT * from ${Event.table}
      WHERE user_id = ?
      ORDER BY created_at ASC`,
    [userId]
  );
}