import { ExplorePost } from "../models/Entity/ExplorePost";
import { User } from "../models/Entity/User";
import { Request, Response, NextFunction } from "express";

const getExplorePosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get all posts
        const posts = await ExplorePost.find({ relations: [ "user" ], order: { id: "DESC" } });

        res.json(posts);
    } catch (e) {
        return next({ message: "Something went wrong!" });
    }
};

const search = async (req: Request, res: Response, next: NextFunction) => {
    const { city } = req.params;

    try {
        const posts = await ExplorePost.createQueryBuilder("explorePost")
            .leftJoinAndSelect("explorePost.user", "user")
            .where("explorePost.city like :city", { city: city + "%" })
            .getMany();

        res.json(posts);
    } catch (e) {
        console.log(e);
        return next({ message: "Something went wrong!" });
    }
};

const createExplorePost = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, latitude, longitude, city, drink, phone, email } = req.body;
    const { userId } = req.params;

    // find user from req.params.id
    try {
        // create post
        const newPost = ExplorePost.create({
            title,
            description,
            latitude,
            longitude,
            city,
            drink,
            phone,
            email,
        });

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
        console.log(e);
        return next({ message: "No user found!" });
    }
};

const editExplorePost = async (req: Request, res: Response, next: NextFunction) => {
    res.json();
};

const deleteExplorePost = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        // find post and delete it
        const [ post ] = await ExplorePost.find({ where: { id } });

        if (!post) {
            return next({ message: `Couldn't find an explore post with id: ${id}` });
        }

        await post.remove();

        res.json({ message: `Successfully deleted the explore post with id: ${id}` });
    } catch (e) {
        console.log(e);
        return next({ message: `Couldn't find an explore post with id: ${id}` });
    }
};

export { getExplorePosts, search, createExplorePost, editExplorePost, deleteExplorePost };
