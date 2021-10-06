import express from "express";
import { createPost, getAllPosts, getPost, editPost, deletePost, likePost } from "../helpers/post";
import { ensureCorrectUser } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPost);
router.post("/:id", createPost);
router.put("/:id/:userId", ensureCorrectUser, editPost);
router.delete("/:id/:userId", ensureCorrectUser, deletePost);

router.put("/likes/:method/:id", likePost);

export default router;
