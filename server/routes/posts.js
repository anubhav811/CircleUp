import express from "express";
import { getFeedPosts, getUserPosts, likePost ,getLikedPosts,getComments,addComment } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/liked/:id", verifyToken, getLikedPosts);
router.get("/:id/get/comment", verifyToken, getComments)

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* CREATE */
router.post("/:id/comment", verifyToken, addComment);

export default router;
