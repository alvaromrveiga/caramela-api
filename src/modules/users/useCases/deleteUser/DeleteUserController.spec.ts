import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

describe("Delete User controller", () => {
  beforeAll(async () => {
    if (!connection) {
      connection = await createConnection();
    }
  });

  beforeEach(async () => {
    await connection.runMigrations();

    await request(app).post("/signup").send({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    const user = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    token = user.body.token;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should not delete user if invalid password", async () => {
    await request(app)
      .delete("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "wrongPassword",
      })
      .expect(400);
  });

  it("Should delete user", async () => {
    await request(app)
      .delete("/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        password: "testerPa$$w0rd",
      })
      .expect(200);
  });
});
