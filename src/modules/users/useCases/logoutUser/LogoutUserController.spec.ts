import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let tokens: string[];

describe("Logout User controller", () => {
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

    const response = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    tokens = response.body.tokens;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not logout user if unauthenticated", async () => {
    await request(app).post("/users/logout").send().expect(401);
  });

  it("Should not logout user if unauthenticated", async () => {
    await request(app)
      .post("/users/logout")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send()
      .expect(200);
  });
});
