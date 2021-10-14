import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let tokens: string[];

describe("Update User Avatar controller", () => {
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

    const user = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    tokens = user.body.tokens;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should update user's avatar", async () => {
    const buffer = Buffer.from("some data");

    await request(app)
      .patch("/users/profile/avatar")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .attach("avatar", buffer, "file.png")
      .expect(200);
  });

  it("Should not update user's avatar if no avatar file", async () => {
    await request(app)
      .patch("/users/profile/avatar")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .attach("avatar", "")
      .expect(400);
  });

  it("Should not update user's avatar if unauthenticated", async () => {
    const buffer = Buffer.from("some data");

    await request(app)
      .patch("/users/profile/avatar")
      .attach("avatar", buffer, "file.png")
      .expect(401);
  });
});
