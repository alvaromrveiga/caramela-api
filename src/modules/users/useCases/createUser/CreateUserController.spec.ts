import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;

describe("Create User controller", () => {
  beforeAll(async () => {
    if (!connection) {
      connection = await createConnection();
      await connection.runMigrations();
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should create user", async () => {
    await request(app)
      .post("/signup")
      .send({
        name: "Tester",
        email: "tester@mail.com",
        password: "testerPa$$w0rd",
      })
      .expect(201);
  });

  it("Should not create user with invalid email", async () => {
    await request(app)
      .post("/signup")
      .send({
        name: "Tester",
        email: "invalidMail",
        password: "testerPa$$w0rd",
      })
      .expect(400);
  });

  it("Should not create user with email already in use", async () => {
    await request(app)
      .post("/signup")
      .send({
        name: "Tester2",
        email: "tester@mail.com",
        password: "tester2Pa$$w0rd",
      })
      .expect(400);
  });

  it("Should not create user with password less than 8 characters", async () => {
    await request(app)
      .post("/signup")
      .send({
        name: "Tester2",
        email: "tester@mail.com",
        password: "1234567",
      })
      .expect(400);
  });
});
