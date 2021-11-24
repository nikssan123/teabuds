import express from "express";
import {
    getExplorePosts,
    search,
    createExplorePost,
    deleteExplorePost,
} from "../helpers/explorePost";
import { ensureCorrectUser } from "../middleware/auth";

const router = express.Router();

router.get("/", getExplorePosts);
router.get("/search/:city", search);
router.post("/:userId", createExplorePost);
router.delete("/:id/:userId", ensureCorrectUser, deleteExplorePost);

export default router;
