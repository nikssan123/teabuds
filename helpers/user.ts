import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from "../models/Entity/User";
import { Request, Response, NextFunction } from "express";

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string;

        // generate random token
        crypto.randomBytes(20, (err, buf) => {
            token = buf.toString("hex");
        });

        const [ user ] = await User.find({
            select: [ "id", "email", "username" ],
            where: { email: req.body.email },
        });

        if (!user) {
            return next({ message: "No user is associated with this email!" });
        }

        // const now = Date.now() + 60 * 60 * 1000; //1 hour

        user.passwordResetToken = token;
        user.resetPasswordExpires = String(Date.now() + 60 * 60 * 1000);

        await user.save();

        const transport = nodemailer.createTransport({
            // service: "gmail",
            // auth: {
            //     user: "fornax.elit@gmail.com",
            //     pass: "******",
            // },
            host: "smtp.gmail.com",
            auth: {
                type: "OAuth2",
                user: "fornax.elit@gmail.com",
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            },
        });

        const mailOptions = {
            to: user.email,
            from: "fornax.elit@gmail.com",
            subject: "Teabuds Password Reset!",
            text:
                "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                "http://" +
                req.headers.host +
                "/api/reset/" +
                token +
                "\n\n" +
                "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };

        transport
            .sendMail(mailOptions)
            .then(() => {
                res.json({ message: "An e-mail has been sent with further instructions!" });
            })
            .catch(err => {
                console.log(err);
                return next({
                    message: "Something happenned while sending the e-mail! Try again later!",
                });
            });
    } catch (error) {
        return next(error);
    }
};

const followUser = async (req: Request, res: Response, next: NextFunction) => {
    // id - current user
    // email - user to be followed
    const { id } = req.params;
    const { email } = req.body;
    try {
        const [ currentUser ] = await User.find({ where: { id } });
        const [ followedUser ] = await User.find({ where: { email } });

        currentUser.following = [ followedUser ];
        followedUser.followers = [ currentUser ];

        await currentUser.save();
        await followedUser.save();

        res.json({
            message: `${currentUser.username} succesffully followed ${followedUser.username}`,
        });
    } catch (e) {
        console.log(e);
        return next({
            message: "Something went wrong!",
        });
    }
};

const unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
    // id - current user
    // email - user to be unfollowed
    const { id } = req.params;
    const { email } = req.body;

    try {
        const [ currentUser ] = await User.find({ where: { id }, relations: [ "following" ] });
        const [ unfollowedUser ] = await User.find({
            where: { email },
            relations: [ "followers" ],
        });

        currentUser.following = currentUser.following.filter(user => user.id !== unfollowedUser.id);
        unfollowedUser.followers = unfollowedUser.followers.filter(
            user => user.id !== currentUser.id
        );

        await currentUser.save();
        await unfollowedUser.save();

        res.json({
            message: `${currentUser.username} succesffully unfollowed ${unfollowedUser.username}`,
        });
    } catch (e) {
        console.log(e);
        return next({
            message: "Something went wrong!",
        });
    }
};

export { forgotPassword, followUser, unfollowUser };
