import express from "express";
import { createPost, getAllPosts } from "../helpers/post";
const router = express.Router();

router.get("/", getAllPosts);
router.post("/:id", createPost);

export default router;
