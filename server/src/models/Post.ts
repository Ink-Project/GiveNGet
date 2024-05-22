import { processImage } from "../utils/image";
import table, { RowType, m } from "../utils/model";
import { Reservation } from "../models";
import { z } from "zod";

export type Post = RowType<typeof posts>;

export type PostWithInfo = Post & {
  images: string[];
  reservations: ReturnType<typeof Reservation.clientFilter>;
};

const posts = table(
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
  }),
);

const images = table(
  "images",
  "id",
  z.object({
    id: z.number().optional(),
    url: z.string(),
    post_id: z.number(),
  }),
);

export const create = async (
  creatorId: number,
  title: string,
  description: string,
  location: string,
  image_urls: string[],
  pickup_times: Date[],
): Promise<PostWithInfo | undefined> => {
  const post = await posts
    .insert()
    .value({ title, description, location, user_id: creatorId })
    .exec()
    .then((p) => p[0]);
  if (!post) {
    return;
  }

  // TODO: use one query to add all at the same time
  const urls = (await Promise.allSettled(image_urls.map(processImage)))
    .filter((img) => {
      if (img.status === "fulfilled") {
        return img;
      }
      // TODO: maybe indicate in the response somehow if images fail to be uploaded
      console.log(`Image process error: ${img.reason}`);
    })
    .map((img) => ({ url: (img as PromiseFulfilledResult<string>).value, post_id: post.id }));

  return {
    ...post,
    images: await images
      .insert()
      .values(urls)
      .exec()
      .then((e) => e.map((e) => e.url)),
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
  return (
    posts
      .select()
      .where({
        title: q ? m.likeInsensitive(`%${q}%`) : undefined,
        user_id: user,
        closed: !closed ? false : undefined,
      })
      // There are other, better ways to do pagination but this is simple
      .limit(limit)
      .offset(offset)
      .orderBy("created_at", order ?? "desc")
      .exec()
  );
};

export const find = (id: number) =>
  posts
    .select()
    .where({ id })
    .exec()
    .then((r) => r[0] as Post | undefined);

export const update = (self: Post, title: string, description: string, location: string) => {
  return posts.update(self, { title, description, location });
};

export const deleteAll = async () => {
  await images.deleteAll();
  await posts.deleteAll();
};

export const close = (self: Post) => posts.update(self, { closed: true });

export const imagesFor = async (post_id: number) => {
  const r = await images.select(["url"]).where({ post_id }).exec();
  return r.map((r_1) => r_1.url);
};
