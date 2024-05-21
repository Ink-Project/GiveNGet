import { processImage } from "../utils/image";
import model, { RowType } from "../utils/model";
import { Reservation } from "../models";
import { z } from "zod";

export type Post = RowType<typeof posts>;

export type PostWithInfo = Post & {
  images: string[];
  reservations: ReturnType<typeof Reservation.clientFilter>;
};

const posts = model(
  "posts",
  "id",
  z.object({
    id: z.number().optional(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    user_id: z.number(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    closed: z.boolean().optional(),
  })
);

export const create = async (
  creatorId: number,
  title: string,
  description: string,
  location: string,
  images: string[],
  pickup_times: Date[]
): Promise<PostWithInfo | undefined> => {
  const post = await posts.create({
    title,
    description,
    location,
    user_id: creatorId,
    closed: false,
  });
  if (!post) {
    return;
  }

  const resImages: string[] = [];
  // TODO: use one query to add all at the same time
  for (const image of await Promise.allSettled(images.map(processImage))) {
    if (image.status === "fulfilled") {
      const res = await Image.create(image.value, post.id);
      if (res) {
        resImages.push(res.url);
      }
    } else {
      // TODO: maybe indicate in the response somehow if images fail to be uploaded
      console.log(`Image process error: ${image.reason}`);
    }
  }

  return {
    ...post,
    images: resImages,
    reservations: Reservation.clientFilter(await Reservation.create(pickup_times, post.id)),
  };
};

export const list = (
  q?: string,
  limit?: number,
  offset?: number,
  user?: number,
  closed?: boolean,
  order?: "desc" | "asc",
) => {
  // There are other, better ways to do pagination but this is simple
  let query = `SELECT * from ${posts.table}`;
  const buf: (string | number)[] = [];

  // prettier-ignore
  {
    const where: string[] = [];
    if (q) { where.push(`lower(title) LIKE lower(?)`); buf.push(`%${q}%`); }
    if (user && user > 0) { where.push(`user_id = ?`); buf.push(user); }
    if (!closed) { where.push(`closed = false`); }

    if (where.length) { query += ` WHERE ${where.join(" AND ")}`; }
    query += ` ORDER BY created_at ${order === "asc" ? "ASC" : "DESC"}`;
    if (limit && limit > 0) { query += ` LIMIT ?`; buf.push(limit); }
    if (offset && offset > 0) { query += ` OFFSET ?`; buf.push(offset); }
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

export const close = (self: Post) => posts.update(self, { closed: true });

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Image {
  const images = model(
    "images",
    "id",
    z.object({
      id: z.number().optional(),
      url: z.string(),
      post_id: z.number(),
    })
  );

  export const create = (url: string, postId: number) => images.create({ url, post_id: postId });

  export const byPost = async (postId: number) => {
    const res = await images.raw(`SELECT url from ${images.table} WHERE post_id = ?`, postId);
    return res.map((r) => (r as { url: string }).url); // TODO: validate?
  };

  export const deleteAll = () => images.deleteAll();
}
