import { app } from "./index";
// import models
import connection from "./models";
connection.connect();

// Start the server on PORT:8081
app.listen(8081, () => {
    console.log("Server started!");
});
