import express from "express";
import { Event, User } from "../models";
import { isValidPassword } from "../utils/auth";
import { checkAuthentication } from "./user";
import { z } from "zod";

const authRouter: express.Router = express.Router();

const userLogin = z.object({
  username: z.string().max(255),
  password: z.string().max(255),
});

// This controller returns 401 if the client is NOT logged in (doesn't have a cookie)
// or returns the user based on the userId stored on the client's cookie
authRouter.get("/me", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.sendStatus(401);
  }

  res.send((await User.find(req.session.userId)) || null);
});

// This controller takes the provided username and password and finds
// the matching user in the database. If the user is found and the password
// is valid, it adds the userId to the cookie (allowing them to stay logged in)
// and sends back the user object.
authRouter.post("/login", async (req, res) => {
  const body = await userLogin.safeParseAsync(req.body);
  if (!body.success) {
    return res.send(400).json(body.error.issues);
  }

  const user = await User.findByUsername(body.data.username);
  if (!user) {
    return res.sendStatus(404);
  }

  if (!await isValidPassword(body.data.password, user.password)) {
    return res.sendStatus(401);
  }

  req.session!.userId = user.id;
  res.send(user);
});

// This controller sets `req.session` to null, destroying the cookie
// which is the thing that keeps them logged in.
authRouter.delete("/logout", async (req, res) => {
  req.session = null;
  res.sendStatus(204);
});

authRouter.get("/inbox", checkAuthentication, async (req, res) => {
  // TODO: pagination and order chronologically?
  return res.send(await Event.inboxFor(req.session!.userId));
});

export default authRouter;
