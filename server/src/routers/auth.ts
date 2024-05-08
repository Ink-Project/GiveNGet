import express from "express";
import User from "../models/User";

const authRouter: express.Router = express.Router();

// This controller returns 401 if the client is NOT logged in (doesn't have a cookie)
// or returns the user based on the userId stored on the client's cookie
authRouter.get("/me", async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.sendStatus(401);
  }

  res.send(await User.find(req.session.userId) || null);
});

// This controller takes the provided username and password and finds
// the matching user in the database. If the user is found and the password
// is valid, it adds the userId to the cookie (allowing them to stay logged in)
// and sends back the user object.
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);
  if (!user) {
    return res.sendStatus(404);
  }

  const isPasswordValid = await user.isValidPassword(password);
  if (!isPasswordValid) {
    return res.sendStatus(401);
  }

  req.session!.userId = user.data.id;
  res.send(user);
});

// This controller sets `req.session` to null, destroying the cookie
// which is the thing that keeps them logged in.
authRouter.delete("/logout", async (req, res) => {
  req.session = null;
  res.sendStatus(204);
});

export default authRouter;
