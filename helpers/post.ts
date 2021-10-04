import { Post } from "../models/Entity/Post";
import { User } from "../models/Entity/User";
import { Request, Response, NextFunction } from "express";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, image = "", likes = 0 } = req.body;
    const { id } = req.params;

    // create post
    const newPost = Post.create({ title, description, image, likes });

    // find user from req.params.id
    try {
        const user = await User.find({ select: [ "id", "email", "username" ], where: { id } });

        // add the user to the post
        newPost.user = user[0];
    } catch (e) {
        return next({ message: "No user found!" });
    }

    // save and return the post
    await newPost.save();

    res.json({ newPost });
};

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get all posts
        const posts = await Post.find({ relations: [ "user" ] });

        res.json(posts);
    } catch (e) {
        return next({ message: "Something went wrong!" });
    }
};

const getPost = async (req: Request, res: Response, next: NextFunction) => {
    // find a post by id, load comments and user relations
    res.json({});
};

export { createPost, getAllPosts };
