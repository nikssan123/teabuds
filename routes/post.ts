import express from "express";
import { createPost, getAllPosts, getPost, editPost, deletePost, likePost } from "../helpers/post";
import { ensureCorrectUser } from "../middleware/auth";
import multer from "multer";

const router = express.Router();

// setup multer
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

// const storage = multer.diskStorage({});

// setup an image filter - accepts only jpg|jpeg|png|gif format
const imageFilter = function(_: any, file: any, cb: any) {
    //accept only those image formats
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Only jpg|jpeg|png|gif files are allowed!"), false);
    }

    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

router.get("/", getAllPosts);
router.get("/:id", getPost);
// router.post("/:userId", upload.single("photo"), createPost);
router.post("/:userId", upload.single("photo"), createPost);
router.put("/:id/:userId", ensureCorrectUser, editPost);
router.delete("/:id/:userId", ensureCorrectUser, deletePost);

router.put("/likes/:method/:id", likePost);

export default router;
