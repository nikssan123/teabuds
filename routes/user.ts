import express from "express";
import { forgotPassword, followUser, unfollowUser } from "../helpers/user";
const router = express.Router();

router.post("/forgot", forgotPassword);
router.post("/follow/:id", followUser);
router.post("/unfollow/:id", unfollowUser);

export default router;
