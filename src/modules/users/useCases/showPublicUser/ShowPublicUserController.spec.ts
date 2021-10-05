import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";
import { User } from "../../infra/typeorm/entities/User";
import { UsersRepository } from "../../infra/typeorm/repositories/UsersRepository";

let connection: Connection;
let tokens: string[];
let user: User | undefined;

describe("Show Public User controller", () => {
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

    await request(app).post("/signup").send({
      name: "Tester2",
      email: "tester2@mail.com",
      password: "tester2Pa$$w0rd",
    });

    const response = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    tokens = response.body.tokens;

    const usersRepository = new UsersRepository();
    user = await usersRepository.findByEmail("tester2@mail.com");
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should show public user information", async () => {
    expect(user).toBeDefined();

    const response = await request(app)
      .get(`/users/${user?.id}`)
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send()
      .expect(200);

    expect(response.body).toHaveProperty("created_at");
    expect(response.body.name).toEqual("Tester2");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).not.toHaveProperty("email");
    expect(response.body).not.toHaveProperty("updated_at");
    expect(response.body).not.toHaveProperty("id");
    expect(response.body).not.toHaveProperty("tokens");
  });

  it("Should not show public user information if unauthenticated", async () => {
    expect(user).toBeDefined();

    await request(app).get(`/users/${user?.id}`).send().expect(401);
  });
});
