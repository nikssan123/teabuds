import express from "express";
import { register, login } from "../helpers/auth";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
