// config the environment variables
require("dotenv").config();

// import express
import express from "express";
const app = express();

// import routes
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import { Error, errorHandler } from "./helpers/error";

// import middleware
import { loginRequired, ensureCorrectUser } from "./middleware/auth";

// Parse json and url params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", authRoutes);
app.use("/api/post", postRoutes);

// (Offset) skip and limit(take) methods -> load only 20 posts at the beginning
app.get("/test", (req, res) => {
    res.status(201).json({ msg: "Success" });
});

// create error for 404 Not Found
app.use((req, res, next) => {
    let err: Error = { status: 404, message: "Not Found" };

    return next(err);
});

// add the error handler
app.use(errorHandler);

// export the server for testing
export { app };
