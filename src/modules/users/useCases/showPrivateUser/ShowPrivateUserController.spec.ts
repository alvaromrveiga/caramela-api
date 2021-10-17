import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let tokens: string[];

describe("Show Private User controller", () => {
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

  it("Should show private user information", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send()
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("updated_at");
    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("tokens");
    expect(response.body.name).toEqual("Tester");
    expect(response.body.email).toEqual("tester@mail.com");

    expect(response.body).not.toHaveProperty("password");
  });

  it("Should not show private user information if unauthenticated", async () => {
    await request(app).get("/users/profile").send().expect(401);
  });
});
