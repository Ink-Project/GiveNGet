import express, { NextFunction, Request, Response } from "express";
import { isAuthorized } from "../utils/auth";
import Post from "../models/Post";
import { checkAuthentication } from "./user";


const postRouter: express.Router = express.Router();


//controller provided as a callback function directly to the router


postRouter.post("/posts", checkAuthentication, async (req,res) => {
   const {
       title,
       description ,
       location,
       images,
       pickup_times,
   } = req.body

   const userId = req.session!.userId;

   const post = await Post.create(userId, title, description, location, images, pickup_times)
   res.send(post)
});


postRouter.get("/posts", async (req,res) => {
   res.send(await Post.list())
})

postRouter.get("posts/:id", async (req, res) => {
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


postRouter.patch("posts/:id", checkAuthentication, async (req, res) => {
const id = +req.params.id;
// Not only do users need to be logged in to update a post, they
// need to be authorized to perform this action for this particular
// user (users should only be able to change their own post)
if (!isAuthorized(id, req.session as { userId: number })) {
    return res.sendStatus(403);
}

const post = await Post.find(id);
if (!post) {
    return res.sendStatus(404);
}

const updated = post.update(req.body.title, req.body.description, req.body.location);
if (!updated) {
    return res.sendStatus(501);
}

res.send(updated);
});