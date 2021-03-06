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
    }
  });

  beforeEach(async () => {
    await connection.runMigrations();

    await request(app).post("/signup").send({
      name: "Tester",
      email: "tester@example.com",
      password: "testerPa$$w0rd",
    });
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should send forgotten password email", async () => {
    await request(app)
      .post("/forgot")
      .send({ email: "tester@example.com" })
      .expect(200);
  });

  it("Should not show error when sending forgotten password email to invalid email", async () => {
    // Also should not send email. This is being tested on ForgotPasswordEmailUseCase.spec.ts
    await request(app)
      .post("/forgot")
      .send({ email: "notRegisteredUser@mail.com" })
      .expect(200);
  });
});
