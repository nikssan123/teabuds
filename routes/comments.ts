import express from "express";
import { createComment, editComment, deleteComment } from "../helpers/comments";
import { ensureCorrectUser } from "../middleware/auth";

const router = express.Router();

router.post("/:postId/:userId", createComment);
router.put("/:commentId/:userId", ensureCorrectUser, editComment);
router.delete("/:commentId/:userId", ensureCorrectUser, deleteComment);

export default router;
