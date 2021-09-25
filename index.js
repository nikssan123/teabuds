const express = require("express");
const app = express();

// Parse json and url params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start the server on PORT:8080
app.listen(8080, () => {
    console.log("Server started!");
});
