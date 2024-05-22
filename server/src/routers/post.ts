import express from "express";
import { z } from "zod";
import { isAuthorized } from "../utils/auth";
import { Post } from "../models";
import { checkAuthentication } from "../utils/auth";

const postRouter: express.Router = express.Router();

const postCreate = z.object({
  title: z.string().max(255),
  description: z.string().max(255),
  location: z.string().max(255),
  images: z.string().url().array(),
  pickup_times: z.coerce.date().array().min(1),
});

const postGet = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().min(0).optional(),
  user: z.coerce.number().min(1).optional(),
  include_closed: z.coerce.boolean().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

const postUpdate = postCreate.omit({ images: true, pickup_times: true });

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
    body.data.pickup_times,
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

  const { q, limit, offset, user, include_closed, order } = query.data;
  const posts = await Post.list(q, limit, offset, user, include_closed, order);
  res.send(await Promise.all(posts.map(Post.getRichPost)));
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

  res.send(await Post.getRichPost(post));
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

  res.send(await Post.getRichPost(updated));
});

postRouter.post("/:id/close", checkAuthentication, async (req, res) => {
  const post = await Post.find(+req.params.id);
  if (!post) {
    return res.sendStatus(404);
  } else if (!isAuthorized(post.user_id, req.session?.userId)) {
    return res.sendStatus(403);
  }

  const updated = await Post.close(post);
  if (!updated) {
    return res.sendStatus(501);
  }

  res.send(await Post.getRichPost(updated));
});

export default postRouter;
