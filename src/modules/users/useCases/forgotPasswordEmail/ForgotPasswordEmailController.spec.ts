import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;

describe("Forgot Password Email controller", () => {
  // Set timeout to await the fake email to be "sent" and console logged
  jest.setTimeout(15000);

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

  it("Should send forgotten password email", async () => {
    await request(app)
      .post("/forgot")
      .send({ email: "tester@mail.com" })
      .expect(200);
  });

  it("Should not send forgotten password email if email is invalid", async () => {
    await request(app)
      .post("/forgot")
      .send({ email: "notRegisteredUser@mail.com" })
      .expect(404);
  });
});
