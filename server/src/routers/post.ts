import express from "express";
import { isAuthorized } from "../utils/auth";
import * as Post from "../models/Post";
import { checkAuthentication } from "./user";
import createValidator from "../utils/validator";

const postRouter: express.Router = express.Router();

const validatePostCreate = createValidator({
  title: "string",
  description: "string",
  location: "string",
  images: "string[]",
  pickup_times: "string[]",
});

postRouter.post("/", checkAuthentication, async (req, res) => {
  const data = validatePostCreate(req.body);
  if (!data) {
    return res.sendStatus(400);
  }

  res.send(await Post.create(
    req.session!.userId,
    data.title,
    data.description,
    data.location,
    data.images,
    data.pickup_times.map((time) => new Date(time)).filter(date => !isNaN(date.getDate()))
  ));
});

postRouter.get("/", async (req, res) => {
  res.send(await Post.list());
});

postRouter.get("/:id", async (req, res) => {
  const id = +req.params.id;
  if (!id) {
    return res.sendStatus(400);
  }

  const user = await Post.find(id);
  if (!user) {
    return res.sendStatus(404);
  }

  res.send(user);
});

postRouter.patch("/:id", checkAuthentication, async (req, res) => {
  const data = validatePostUpdate(req.body);
  if (!data) {
    return res.sendStatus(400);
  }

  const id = +req.params.id;
  const post = await Post.find(id);
  if (!post) {
    return res.sendStatus(404);
  }

  // Not only do users need to be logged in to update a post, they
  // need to be authorized to perform this action for this particular
  // user (users should only be able to change their own post)
  if (!isAuthorized(post.user_id, req.session?.userId)) {
    return res.sendStatus(403);
  }

  const updated = await Post.update(post, data.title, data.description, data.location);
  if (!updated) {
    return res.sendStatus(501);
  }

  res.send(updated);
});

export default postRouter;
