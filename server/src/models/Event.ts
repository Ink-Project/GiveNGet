import model from "./model";

export const EVENT_TYPES = ["reserved", "cancelled"] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export default class Event extends model("event_log", {
  id: "pkey",
  event: "string",
  user_id: "number",
  actor_id: "number",
  post_id: "number",
  created_at: "timestamp",
}) {
  private static must(data?: typeof Event.prototype.data) {
    if (!data) {
      // TODO
      throw new Error(`Validation failed for data: ${data}`);
    }

    return new Event(data);
  }

  /**
   * @param userId The ID for the user this event is relevant to
   * @param actorId The ID of the user that initiated this event, ex. for a cancel event, this is
   * the user that initiated the cancel.
   */
  static async create(event: EventType, postId: number, userId: number, actorId: number) {
    return Event.must(
      await Event.createRaw({ event, post_id: postId, user_id: userId, actor_id: actorId })
    );
  }

  static async inboxFor(userId: number) {
    const data = await Event.queryMany(
      `
        SELECT * from ${Event.table}
        WHERE user_id = ?
        ORDER BY created_at ASC`,
      [userId]
    );
    return data.map(Event.must);
  }
}
