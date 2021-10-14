import { Post } from "../models/Entity/Post";
import { User } from "../models/Entity/User";
import { Comments } from "../models/Entity/Comments";
import { Request, Response, NextFunction } from "express";

/**
 * ! same model applies for all the methods
 * 
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 * 
 */
const createComment = async (req: Request, res: Response, next: NextFunction) => {
    const { postId, userId } = req.params;
    const { message } = req.body;

    try {
        const [ user ] = await User.find({ where: { id: userId } });
        const [ post ] = await Post.find({ where: { id: postId } });

        if (!user) {
            return next({ message: `No user with id '${userId}' found` });
        }

        if (!post) {
            return next({ message: `No post with id '${userId}' found` });
        }

        const newComment = Comments.create({ message, user, post });

        await newComment.save();

        res.json(newComment);
    } catch (e) {
        console.log(e);
        return next({ message: e.msg ? e.msg : "Something went wrong!" });
    }
};

const editComment = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const { message } = req.body;

    try {
        const [ comment ] = await Comments.find({ where: { id: commentId } });

        if (!comment) {
            return next({ message: `No comment with id: ${commentId} found!` });
        }

        comment.message = message;

        await comment.save();

        res.json({ comment });
    } catch (e) {
        console.log(e);
        return next({ message: e.msg ? e.msg : "Something went wrong!" });
    }
};

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    try {
        // find post and delete post
        const [ comment ] = await Comments.find({ where: { id: commentId } });

        if (!comment) {
            return next({ message: `Couldn't find a post with id: ${commentId}` });
        }

        await comment.remove();

        res.json({ message: `Successfully deleted the post with id: ${commentId}` });
    } catch (e) {
        console.log(e);
        return next({ message: `Couldn't find a post with id: ${commentId}` });
    }
};

export { createComment, editComment, deleteComment };
