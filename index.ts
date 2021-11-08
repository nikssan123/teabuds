// config the environment variables
require("dotenv").config();

// import express
import express from "express";
const app = express();

import cors from "cors";

// import routes
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import commentsRoutes from "./routes/comments";
import userRoutes from "./routes/user";
import { Error, errorHandler } from "./helpers/error";

// import middleware
import { loginRequired } from "./middleware/auth";

// configure cors
app.use(cors());

// Parse json and url params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", authRoutes);
app.use("/api/post", loginRequired, postRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/user", userRoutes);

// create error for 404 Not Found
app.use((req, res, next) => {
    let err: Error = { status: 404, message: "Not Found" };

    return next(err);
});

// add the error handler
app.use(errorHandler);

// export the server for testing
export { app };
