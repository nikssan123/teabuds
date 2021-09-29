// config the environment variables
require("dotenv").config();

// import express
import express from "express";
const app = express();

// import models and routes
import "./models";
import authRoutes from "./routes/auth";
import { Error, errorHandler } from "./helpers/error";

// import middleware
import { loginRequired, ensureCorrectUser } from "./middleware/auth";

// Parse json and url params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", authRoutes);

// (Offset) skip and limit(take) methods -> load only 20 posts at the beginning
app.get("/test", loginRequired, (req, res) => {
    res.json({ msg: "Success" });
});

// create error for 404 Not Found
app.use((req, res, next) => {
    let err: Error = { status: 404, message: "Not Found" };

    return next(err);
});

// add the error handler
app.use(errorHandler);

// Start the server on PORT:8081
app.listen(8081, () => {
    console.log(process.env.NODE_ENV);
    console.log("Server started!");
});

// export the server for testing
export default app;
