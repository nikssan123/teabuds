import { createConnection } from "typeorm";
import { User } from "./Entity/User";

export default createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [ User ],
    synchronize: true,
    logging: true,
});
