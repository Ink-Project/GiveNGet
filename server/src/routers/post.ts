import express from "express";
import { isAuthorized } from "../utils/auth";
import { Post, Reservation } from "../models";
import { checkAuthentication } from "./user";
import { z } from "zod";

const postRouter: express.Router = express.Router();

const postCreate = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  images: z.string().url().array(),
  pickup_times: z.coerce.date().array(),
});

const postGet = z.object({
  q: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().min(0).optional(),
  user: z.number().min(1).optional(),
});

const postUpdate = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
});

const getAuxPostInfo = async (post?: Post.Post): Promise<Post.PostWithInfo | undefined> => {
  return post
    ? {
        ...post,
        images: await Post.Image.byPost(post.id),
        reservations: await Reservation.byPostForClient(post.id),
      }
    : undefined;
};

postRouter.post("/", checkAuthentication, async (req, res) => {
  const body = await postCreate.safeParseAsync(req.body);
  if (!body.success) {
    return res.status(400).json(body.error.issues);
  }

  const post = await Post.create(
    req.session!.userId,
    body.data.title,
    body.data.description,
    body.data.location,
    body.data.images,
    body.data.pickup_times
  );
  if (!post) {
    return res.sendStatus(500);
  }

  res.send(post);
});

postRouter.get("/", async (req, res) => {
  const query = await postGet.safeParseAsync(req.query);
  if (!query.success) {
    return res.status(400).json(query.error.issues);
  }

  const { q, limit, offset, user } = query.data;
  const posts = await Post.list(q, limit ?? -1, offset ?? -1, user ?? -1);
  res.send(await Promise.all(posts.map(getAuxPostInfo)));
});

postRouter.get("/:id", async (req, res) => {
  const id = +req.params.id;
  if (!id) {
    return res.sendStatus(400);
  }

  const post = await Post.find(id);
  if (!post) {
    return res.sendStatus(404);
  }

  res.send(await getAuxPostInfo(post));
});

postRouter.patch("/:id", checkAuthentication, async (req, res) => {
  const body = await postUpdate.safeParseAsync(req.body);
  if (!body.success) {
    return res.sendStatus(400);
  }

  const post = await Post.find(+req.params.id);
  if (!post) {
    return res.sendStatus(404);
  }

  // Not only do users need to be logged in to update a post, they
  // need to be authorized to perform this action for this particular
  // user (users should only be able to change their own post)
  if (!isAuthorized(post.user_id, req.session?.userId)) {
    return res.sendStatus(403);
  }

  const { title, description, location } = body.data;
  const updated = await Post.update(post, title, description, location);
  if (!updated) {
    return res.sendStatus(501);
  }

  res.send(await getAuxPostInfo(updated));
});

export default postRouter;
