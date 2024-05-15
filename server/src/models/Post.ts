import model, { RowType } from "../utils/model";
import * as Reservation from "./Reservation";

export type Post = RowType<typeof posts>;

const posts = model("posts", {
  id: "pkey",
  title: "string",
  description: "string",
  location: "string",
  user_id: "number",
  created_at: "timestamp",
  updated_at: "timestamp",
});

/**
 * @param images Must be the URLs to the images on our server, not the urls/blobs given by the user
 */
export const create = async (
  creatorId: number,
  title: string,
  description: string,
  location: string,
  images: string[],
  pickup_times: Date[]
) => {
  const post = await posts.create({ title, description, location, user_id: creatorId });
  if (!post) {
    return;
  }

  // TODO: use one query to add all at the same time
  for (const image of images) {
    Image.create(image, post.id);
  }

  for (const time of pickup_times) {
    Reservation.create(time, post.id);
  }

  return post;
};

export const list = (q?: string, limit: number = -1, offset: number = -1, user: number = -1) => {
  // There are other, better ways to do pagination but this is simple
  let query = `SELECT * from ${posts.table}`;
  const buf: (string | number)[] = [];

  // prettier-ignore
  {
    const where: string[] = [];
    if (q) { where.push(`lower(title) LIKE lower(?)`); buf.push(`%${q}%`); }
    if (user > 0) { where.push(`user_id = ?`); buf.push(user); }
    if (where.length) { query += ` WHERE ${where.join("AND")}`; }
    if (limit > 0) { query += ` LIMIT ?`; buf.push(limit); }
    if (offset > 0) { query += ` OFFSET ?`; buf.push(offset); }
  }

  return posts.queryMany(query, buf);
};

export const find = (id: number) => posts.findBy("id", id);

export const update = (self: Post, title: string, description: string, location: string) => {
  return posts.update(self, { title, description, location });
};

export const deleteAll = async () => {
  await Image.deleteAll();
  await posts.deleteAll();
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Image {
  const images = model("images", {
    id: "pkey",
    url: "string",
    post_id: "number",
  });

  export const create = (url: string, postId: number) => images.create({ url, post_id: postId });

  export const byPost = async (postId: number) => {
    const res = await images.raw(`SELECT url from ${images.table} WHERE post_id = ?`, postId);
    return res.map(r => (r as { url: string }).url); // TODO: validate?
  };

  export const deleteAll = () => images.deleteAll();
}
