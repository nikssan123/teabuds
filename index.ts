require("dotenv").config();

import express from "express";
const app = express();

import "./models";
import authRoutes from "./routes/auth";
import { Error, errorHandler } from "./helpers/error";

// Parse json and url params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);

// routes
app.use((req, res, next) => {
    let err: Error = { status: 404, message: "Not Found" };

    return next(err);
});

app.use(errorHandler);

// Start the server on PORT:8080
app.listen(8081, () => {
    console.log("Server started!");
});
