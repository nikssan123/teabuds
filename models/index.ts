import { createConnection } from "typeorm";
import { User } from "./Entity/User";

// use mock table for testing -> process.env.NODE_ENV === "test"
export default createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [ User ],
    synchronize: true,
    // logging: true,
});
