import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let tokens: string;

describe("Update User controller", () => {
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

  it("Should update user", async () => {
    const response = await request(app)
      .put("/users/profile")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        name: "UpdatedTester",
        email: "updatedTester@mail.com",
        password: "updatedPassword",
        currentPassword: "testerPa$$w0rd",
      })
      .expect(200);

    expect(response.body.name).toEqual("UpdatedTester");
    expect(response.body.email).toEqual("updatedtester@mail.com");

    expect(response.body).not.toHaveProperty("currentPassword");
    expect(response.body).not.toHaveProperty("password");
  });

  it("Should not update user with invalid update field", async () => {
    await request(app)
      .put("/users/profile")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        id: "c4b7c21a-4285-4c24-a781-417d9990a44d",
        name: "UpdatedTester",
      })
      .expect(400);
  });

  it("Should not update user password if current password is empty", async () => {
    await request(app)
      .put("/users/profile")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        name: "UpdatedTester",
        email: "updatedTester@mail.com",
        password: "updatedPassword",
      })
      .expect(400);
  });

  it("Should not update user password if current password is invalid", async () => {
    await request(app)
      .put("/users/profile")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        name: "UpdatedTester",
        email: "updatedTester@mail.com",
        password: "updatedPassword",
        currentPassword: "wrongPassword",
      })
      .expect(400);
  });

  it("Should not update user if unauthenticated", async () => {
    await request(app)
      .put("/users/profile")
      .send({
        name: "UpdatedTester",
        email: "updatedTester@mail.com",
        password: "updatedPassword",
        currentPassword: "testerPa$$w0rd",
      })
      .expect(401);
  });
});
