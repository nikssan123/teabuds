require("dotenv").config();

import express from "express";
const app = express();

import "./models";
import authRoutes from "./routes/auth";

// Parse json and url params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);

// routes
app.get("*", (req, res) => {
    res.send("404 Not Found");
});

// Start the server on PORT:8080
app.listen(8081, () => {
    console.log("Server started!");
});
