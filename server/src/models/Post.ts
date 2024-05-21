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

export const create = async (
  creatorId: number,
  title: string,
  description: string,
  location: string,
  images: string[],
  pickup_times: Date[],
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
  await Image.deleteAll();
  await posts.deleteAll();
};

export const close = (self: Post) => posts.update(self, { closed: true });

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Image {
  const images = table(
    "images",
    "id",
    z.object({
      id: z.number().optional(),
      url: z.string(),
      post_id: z.number(),
    }),
  );

  export const create = (url: string, postId: number) => images.create({ url, post_id: postId });

  export const byPost = async (post_id: number) => {
    const r = await images.select(["url"]).where({ post_id }).exec();
    return r.map((r_1) => r_1.url);
  };

  export const deleteAll = () => images.deleteAll();
}
