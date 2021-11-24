import { ConnectionOptions, getConnectionManager } from "typeorm";

import { User } from "./Entity/User";
import { Post } from "./Entity/Post";
import { Comments } from "./Entity/Comments";
import { ExplorePost } from "./Entity/ExplorePost";

const options: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.NODE_ENV === "test" ? process.env.DB_TEST_NAME : process.env.DB_NAME,
    // can't pass ts and js files
    // ts-node || node
    // entities: [ __dirname + "/Entity/*.ts" ],
    entities: [ User, Post, Comments, ExplorePost ],
    synchronize: true,
};

const connectionManager = getConnectionManager();
const connection = connectionManager.create(options);

export default connection;
