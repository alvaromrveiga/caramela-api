import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

describe("Show Tokens controller", () => {
  beforeAll(async () => {
    if (!connection) {
      connection = await createConnection();
    }
  });

  beforeEach(async () => {
    await connection.runMigrations();

    await request(app).post("/signup").send({
      name: "OtherTester",
      email: "otherTester@mail.com",
      password: "testerPa$$w0rd",
    });

    await request(app).post("/login").send({
      email: "otherTester@mail.com",
      password: "testerPa$$w0rd",
    });

    await request(app).post("/signup").send({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    const response = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    token = response.body.token;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should show one session for two same login machines", async () => {
    const response = await request(app)
      .get("/users/sessions")
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(response.body.length).toEqual(1);
  });

  it("Should not show tokens if unauthenticated", async () => {
    await request(app).get("/users/sessions").send().expect(401);
  });
});
