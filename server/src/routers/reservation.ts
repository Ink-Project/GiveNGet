import express from "express";
import Reservation from "../models/Reservation";
import { checkAuthentication } from "./user";
import Post from "../models/Post";

const resvRouter: express.Router = express.Router();

resvRouter.post("/:id/select", checkAuthentication, async (req, res) => {
  const userId = req.session!.userId;
  const resvId = +req.params.id;
  if (!resvId) {
    return res.sendStatus(403);
  }

  const resv = await Reservation.find(resvId);
  if (!resv || resv.data.user_id !== null) { // doesn't exist or already reserved
    return res.sendStatus(403);
  }

  const post = await Post.find(resv.data.post_id);
  if (!post) {
    return res.sendStatus(500);
  }

  if (post.data.user_id === resv.data.id) { // can't reserve times on own post
    return res.sendStatus(403);
  }

  return res.send(resv.select(userId));
});

resvRouter.post("/:id/cancel", checkAuthentication, async (req, res) => {
  const userId = req.session!.userId;
  const resvId = +req.params.id;
  if (!resvId) {
    return res.sendStatus(403);
  }

  const resv = await Reservation.find(resvId);
  if (!resv) {
    return res.sendStatus(403);
  }

  const post = await Post.find(resv.data.post_id);
  if (!post) {
    return res.sendStatus(500);
  }

  if (post.data.user_id !== userId && resv.data.user_id !== userId) {
    return res.sendStatus(401);
  }

  return res.send(resv.cancel(post.data.user_id, userId));
});

export default resvRouter;
