import express from "express";
import { Post, Reservation } from "../models";
import { checkAuthentication } from "./user";

const resvRouter: express.Router = express.Router();

resvRouter.post("/:id/select", checkAuthentication, async (req, res) => {
  const userId = req.session!.userId;
  const resvId = +req.params.id;
  if (!resvId) {
    return res.sendStatus(401);
  }

  const resv = await Reservation.find(resvId);
  if (!resv) {
    return res.sendStatus(404);
  }

  if (resv.user_id !== null) { // doesn't exist or already reserved
    return res.sendStatus(403);
  }

  const post = await Post.find(resv.post_id);
  if (!post) {
    return res.sendStatus(500);
  }

  if (post.user_id === resv.id) { // can't reserve times on own post
    return res.sendStatus(401);
  }

  return res.send(await Reservation.select(resv, post.user_id, userId));
});

resvRouter.post("/:id/cancel", checkAuthentication, async (req, res) => {
  const userId = req.session!.userId;
  const resvId = +req.params.id;
  if (!resvId) {
    return res.sendStatus(401);
  }

  const resv = await Reservation.find(resvId);
  if (!resv) {
    return res.sendStatus(404);
  }

  const post = await Post.find(resv.post_id);
  if (!post) {
    return res.sendStatus(500);
  }

  if (post.user_id !== userId && resv.user_id !== userId) {
    return res.sendStatus(403);
  }

  return res.send(await Reservation.cancel(resv, post.user_id, userId));
});

export default resvRouter;
