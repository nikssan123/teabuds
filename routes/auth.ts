import express from "express";
import { register, login, resetPassword } from "../helpers/auth";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/reset/:token", resetPassword);

export default router;
