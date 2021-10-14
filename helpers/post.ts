import { Post } from "../models/Entity/Post";
import { User } from "../models/Entity/User";
import { Request, Response, NextFunction } from "express";

/**
 * ! same model applies for all the methods
 * 
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 * 
 */
const createPost = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, image = "", likes = 0 } = req.body;
    const { userId } = req.params;

    // create post
    const newPost = Post.create({ title, description, image, likes });

    // find user from req.params.id
    try {
        const user = await User.find({
            select: [ "id", "email", "username" ],
            where: { id: userId },
        });

        // add the user to the post
        newPost.user = user[0];
    } catch (e) {
        return next({ message: "No user found!" });
    }

    // save and return the post
    await newPost.save();

    res.json({ newPost });
};

// (Offset) skip and limit(take) methods -> load only 20 posts at the beginning
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
    const { id } = req.params;
    try {
        // find a post by id, load comments and user relations
        const [ post ] = await Post.find({
            where: { id },
            relations: [ "comments", "user", "comments.user" ],
        });

        if (!post) {
            return next({ message: `Couldn't find a post with id: ${id}` });
        }

        res.status(200).json(post);
    } catch (e) {
        console.log(e);
        return next({ message: `Couldn't find a post with id: ${id}` });
    }
};

const editPost = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { title, description, image } = req.body;

    try {
        // find post
        const [ post ] = await Post.find({ where: { id } });

        if (!post) {
            return next({ message: `Couldn't find a post with id: ${id}` });
        }

        /**
         * ? Don't run update when values are not provided
         * title ? (post.title = title) : null;
         * description ? (post.description = description) : null;
         * image ? (post.image = image) : null;
         */

        /**
         * ! Update values everytime -> allows to reset or nullufy fields
         * ! It's up to the client to implement the functionallity as intended
         */

        // update values
        post.title = title;
        post.description = description;
        post.image = image;

        //update it with save method
        await post.save();

        res.json(post);
    } catch (e) {
        console.log(e);
        return next({ message: `Couldn't find a post with id: ${id}` });
    }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        // find post and delete post
        const [ post ] = await Post.find({ where: { id } });

        if (!post) {
            return next({ message: `Couldn't find a post with id: ${id}` });
        }

        await post.remove();

        res.json({ message: `Successfully deleted the post with id: ${id}` });
    } catch (e) {
        console.log(e);
        return next({ message: `Couldn't find a post with id: ${id}` });
    }
};

const likePost = async (req: Request, res: Response, next: NextFunction) => {
    const { id, method } = req.params;

    try {
        // find post and increment like count
        const [ post ] = await Post.find({ where: { id } });

        if (!post) {
            return next({ message: `Couldn't find a post with id: ${id}` });
        }

        if (method.toLowerCase() === "like") {
            post.likes++;
        } else if (method.toLowerCase() === "unlike") {
            if (post.likes > 0) post.likes--;
            else return next({ message: "You already have 0 likes" });
        } else {
            return next({ message: `${method} is not a valid method!` });
        }

        await post.save();

        res.json(post);
    } catch (e) {
        console.log(e);
        return next({ message: `Couldn't find a post with id: ${id}` });
    }
};

export { createPost, getAllPosts, getPost, editPost, deletePost, likePost };
