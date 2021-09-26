import { Request, Response, NextFunction } from "express";

interface Error {
    status?: number;
    message: string;
}

function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
    return response.status(error.status || 500).json({
        error: {
            message: error.message || "Something went wrong.",
        },
    });
}

export { errorHandler, Error };
