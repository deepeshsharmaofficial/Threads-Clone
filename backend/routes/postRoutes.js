import express from "express";
import { createPost, deletePost, getPost, likeUnlikePost, replyToPost, getFeedPosts } from "../controller/postController.js";
import protectRoutes from "../middlewares/protectRoutes.js";

const router = express.Router();

router.get("/feed", protectRoutes, getFeedPosts);
router.get("/:id", protectRoutes, getPost);
router.post("/create", protectRoutes, createPost);
router.delete("/:id", protectRoutes, deletePost);
router.post("/like/:id", protectRoutes, likeUnlikePost);
router.post("/reply/:id", protectRoutes, replyToPost);


export default router;