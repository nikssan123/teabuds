import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (decoded) {
                return next();
            } else {
                return next({
                    error: 401,
                    message: "Please login first",
                });
            }
        });
    } catch (e) {
        return next({
            error: 401,
            message: "Please login first",
        });
    }
};

const ensureCorrectUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (decoded && decoded.id === Number(req.params.userId)) {
                return next();
            } else {
                return next({
                    error: 401,
                    message: "Unauthorized",
                });
            }
        });
    } catch (e) {
        return next({
            error: 401,
            message: "Please login first",
        });
    }
};

export { loginRequired, ensureCorrectUser };
