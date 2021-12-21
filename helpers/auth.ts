import { User } from "../models/Entity/User";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send("You must specify username, email and password!");
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return res.json({ message: "Invalid Email!" });
    }

    try {
        const user = await User.create({ username, email, password });
        const { id } = await User.save(user);

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
    } catch (e) {
        return res.json({ message: "Something went wrong!" });
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // User.find({sk})
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

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password1, password2 } = req.body;

    if (!password1 || !password2) {
        return next({
            message: "You have to specify a password!",
        });
    }

    try {
        const [ user ] = await User.find({ where: { passwordResetToken: token } });

        const date = new Date(Number(user.resetPasswordExpires));

        if (!lessThanOneHourAgo(date)) {
            return next({ message: "The reset token has expired!" });
        }

        if (password1 !== password2) {
            return next({ message: "Passwords do not match!" });
        }

        user.password = password1;

        await user.save();

        res.json({ message: "Successfully updated password!" });
    } catch (e) {
        console.log(e);
        return next({
            status: 404,
            message: "Couldn't find a user!",
        });
    }
};

// Utils

const lessThanOneHourAgo = (date: Date): boolean => {
    // date.getHours();
    // const date1 = date.getTime();
    const HOUR = 1000 * 60 * 60;
    const anHourAgo = Date.now() - HOUR;

    return date.getTime() > anHourAgo;
};

export { register, login, resetPassword };
