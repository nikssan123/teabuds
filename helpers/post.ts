import { Post } from "../models/Entity/Post";
import { User } from "../models/Entity/User";
import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";

//Set up Cloudinary
cloudinary.v2.config({
    cloud_name: "nikssan123",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * ! same model applies for all the methods
 * 
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 * 
 */
const createPost = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, likes = 0 } = req.body;
    const { userId } = req.params;

    let image = "";

    // find user from req.params.id
    try {
        let imageId = "";
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            image = result.secure_url;
            imageId = result.public_id;
        }

        // create post
        const newPost = Post.create({ title, description, image, imageId, likes });

        const user = await User.find({
            select: [ "id", "email", "username" ],
            where: { id: userId },
        });

        // add the user to the post
        newPost.user = user[0];

        // save and return the post
        await newPost.save();

        res.json({ newPost });
    } catch (e) {
        return next({ message: "No user found!" });
    }
};

// (Offset) skip and limit(take) methods -> load only 20 posts at the beginning
const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get all posts
        const posts = await Post.find({ relations: [ "user" ], order: { id: "DESC" } });

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
        // find post and delete it
        const [ post ] = await Post.find({ where: { id } });

        if (!post) {
            return next({ message: `Couldn't find a post with id: ${id}` });
        }

        if (post.imageId) {
            await cloudinary.v2.uploader.destroy(post.imageId);
        }

        await post.remove();

        res.json({ message: `Successfully deleted the post with id: ${id}`, id });
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
