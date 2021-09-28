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

    await request(app).post("/signup").send({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should login user", async () => {
    await request(app)
      .post("/login")
      .send({
        email: "tester@mail.com",
        password: "testerPa$$w0rd",
      })
      .expect(200);
  });

  it("Should not login user if email is wrong", async () => {
    await request(app)
      .post("/login")
      .send({
        email: "wrongEmail",
        password: "testerPa$$w0rd",
      })
      .expect(400);
  });

  it("Should not login user if password is wrong", async () => {
    await request(app)
      .post("/login")
      .send({
        email: "tester@mail.com",
        password: "wrongPassword",
      })
      .expect(400);
  });
});
