import express from "express";
import { z } from "zod";
import { checkAuthentication, isAuthorized } from "../utils/auth";
import { User } from "../models";

const userRouter: express.Router = express.Router();

const userCreate = z.object({
  username: z.string().max(255),
  password: z.string().max(255).min(3),
});

userRouter.post("/", async (req, res) => {
  const body = await userCreate.safeParseAsync(req.body);
  if (!body.success) {
    return res.status(400).json(body.error.issues);
  }

  try {
    const user = await User.create(body.data.username, body.data.password);
    if (!user) {
      return res.sendStatus(500);
    }

    req.session!.userId = user!.id; // TODO: no !
    res.send(user);
  } catch {
    return res.sendStatus(409);
  }
});

userRouter.get("/", async (_req, res) => {
  res.send(await User.list());
});

userRouter.get("/:id", async (req, res) => {
  const id = +req.params.id;
  if (!id) {
    return res.sendStatus(400);
  }

  const user = await User.find(id);
  if (!user) {
    return res.sendStatus(404);
  }

  res.send(user);
});

userRouter.patch("/:id", checkAuthentication, async (req, res) => {
  const id = +req.params.id;
  // Not only do users need to be logged in to update a user, they
  // need to be authorized to perform this action for this particular
  // user (users should only be able to change their own profiles)
  if (!isAuthorized(id, req.session?.userId)) {
    return res.sendStatus(403);
  }

  const user = await User.find(id);
  if (!user) {
    return res.sendStatus(404);
  }

  const updated = User.update(user, req.body.username);
  if (!updated) {
    return res.sendStatus(501);
  }

  res.send(updated);
});

export default userRouter;
