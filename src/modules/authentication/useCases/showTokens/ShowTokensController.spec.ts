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
      machineInfo: "Other Tester PC 127.0.0.1",
    });

    await request(app).post("/signup").send({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
      machineInfo: "Tester PC 127.0.0.1",
    });

    await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
      machineInfo: "Tester's Work PC 192.168.0.1",
    });

    const response = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
      machineInfo: "Tester Phone 127.0.0.1",
    });

    token = response.body.token;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should show tokens", async () => {
    const response = await request(app)
      .get("/users/sessions")
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(response.body.length).toEqual(3);
  });

  it("Should not show tokens if unauthenticated", async () => {
    await request(app).get("/users/sessions").send().expect(401);
  });
});
