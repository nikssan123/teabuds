import { User } from "../models/Entity/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send("You must specify username, email and password!");
    }

    const { id } = await User.save(User.create({ username, email, password }));

    const token = jwt.sign(
        {
            id,
            email,
            username,
        },
        process.env.SECRET_KEY
    );

    return res.status(200).json({
        email,
        username,
        token,
    });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        const { username, id } = user;

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            const token = jwt.sign(
                {
                    id,
                    email,
                    username,
                },
                process.env.SECRET_KEY
            );

            return res.status(200).json({
                id,
                email,
                username,
                token,
            });
        } else {
            return next({
                status: 400,
                message: "Invalid Email/Password",
            });
        }
    } catch (e) {
        return next({
            status: 400,
            message: "Invalid Email/Password",
        });
    }
};

export { register, login };
