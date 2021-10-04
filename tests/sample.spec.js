const request = require("supertest");

const { app } = require("../dist/index");
const { User } = require("../dist/models/Entity/User");
const { Post } = require("../dist/models/Entity/Post");

const { createConnection, getConnection } = require("typeorm");

const options = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.NODE_ENV === "test" ? process.env.DB_TEST_NAME : process.env.DB_NAME,
    entities: [ User, Post ],
    migrationsRun: true,
    synchronize: true,
    // drop the table for testing -> reseting it
    dropSchema: true,
};

// fail the test after 10s
jest.setTimeout(10000);

describe("Sample Test", () => {
    beforeAll(async () => {
        await createConnection(options);
    });
    afterAll(async () => {
        const connection = await getConnection();
        await connection.close();
    });

    it("should test that true === true", async () => {
        const res = await request(app)
            .post("/api/register")
            .send({ email: "test1234", username: "test1234", password: "123" });

        expect(res.statusCode).toEqual(200);
    });
});
