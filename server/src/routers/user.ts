import express from "express";
import { z } from "zod";
import { checkAuthentication, isAuthorized, isValidPassword } from "../utils/auth";
import { User } from "../models";

const userRouter: express.Router = express.Router();

const userCreate = z.object({
  username: z.string().max(255).min(3),
  password: z.string().max(255).min(3),
  full_name: z.string().max(255).min(3).optional(),
});

const userUpdate = z.object({
  username: z.string().min(3).optional(),
  password: z
    .object({
      original: z.string().max(255).min(3),
      updated: z.string().max(255).min(3),
    })
    .optional(),
  profile_image: z.string().optional(),
  full_name: z.string().optional(),
});

export type UserCreateParams = z.infer<typeof userCreate>;
export type UserUpdateParams = z.infer<typeof userUpdate>;

userRouter.post("/", async (req, res) => {
  const body = await userCreate.safeParseAsync(req.body);
  if (!body.success) {
    return res.status(400).json(body.error.issues);
  }

  try {
    const user = await User.create(body.data.username, body.data.password, body.data.full_name);
    if (!user) {
      return res.sendStatus(500);
    }

    req.session!.userId = user!.id; // TODO: no !
    res.send(user);
  } catch (err) {
    console.warn(err);
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
  if (!isAuthorized(id, req.session?.userId)) {
    return res.sendStatus(403);
  }

  const body = await userUpdate.safeParseAsync(req.body);
  if (!body.success) {
    return res.status(400).json(body.error.issues);
  }

  const user = await User.find(id);
  if (!user) {
    return res.sendStatus(404);
  }

  // require original password to change the password, prevents against an attacker who steals your
  // session/has local access from changing your password and locking you out
  const { username, password, profile_image, full_name } = body.data;
  if (password && !(await isValidPassword(password.original, user.password))) {
    return res.status(403).json("password mismatch");
  }

  const updated = await User.update(user, username, password?.updated, full_name, profile_image);
  if (!updated) {
    return res.sendStatus(501);
  }

  res.send(updated);
});

export default userRouter;
