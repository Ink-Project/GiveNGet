import express, { NextFunction, Request, Response } from "express";
import { isAuthorized } from "../utils/auth";
import User from "../models/User";

// Is the user logged in? Not specific user, just ANY user
const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
  if (typeof req.session?.userId !== "number") {
    return res.sendStatus(401);
  }

  return next();
};

const userRouter: express.Router = express.Router();

userRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  // TODO: check if username is taken, and if it is what should you return?
  const user = await User.create(username, password);
  req.session!.userId = user!.data.id; // TODO: no !

  res.send(user);
});

// These actions require users to be logged in (authentication)
// Express lets us pass a piece of middleware to run for a specific endpoint
userRouter.get("/", checkAuthentication, async (_req, res) => {
  res.send(await User.list());
});

userRouter.get("/:id", checkAuthentication, async (req, res) => {
  const user = await User.find(+req.params.id);
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
  if (!isAuthorized(id, req.session as { userId: number })) {
    return res.sendStatus(403);
  }

  const user = await User.find(id);
  if (!user) {
    return res.sendStatus(404);
  }

  const updated = user.update(req.body.username);
  if (!updated) {
    return res.sendStatus(501);
  }

  res.send(updated);
});

export default userRouter;
