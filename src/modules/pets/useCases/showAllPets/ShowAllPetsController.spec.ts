import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

describe("Show All Pets controller", () => {
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

    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Meow",
        gender: "Female",
        species: "Cat",
        weight_kg: "2.0",
        birthday: "2020-07-14",
      });

    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "TicTic",
        gender: "Female",
        species: "Hamster",
        weight_kg: "0.1",
        birthday: "2021-02-20",
      });
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should show all user pets", async () => {
    await request(app)
      .get("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);
  });

  it("Should not show all user pets if unauthenticated", async () => {
    await request(app).get("/users/pets").send().expect(401);
  });
});
