import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

describe("Create Pet controller", () => {
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

    token = user.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should create pet", async () => {
    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Meow",
        gender: "Female",
        species: "Cat",
        weight_kg: "2.0",
        birthday: "2020-07-14",
      })
      .expect(201);
  });

  it("Should not create pet if user already has a pet with the same name", async () => {
    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Meow",
        gender: "Male",
        weight_kg: "4.0",
        birthday: "2020-09-22",
      })
      .expect(400);
  });

  it("Should not create pet if unauthenticated", async () => {
    await request(app)
      .post("/users/pets")
      .send({
        name: "Meow",
        gender: "Female",
        species: "Cat",
        weight_kg: "2.0",
        birthday: "2020-07-14",
      })
      .expect(401);
  });

  it("Should not create pet if name is invalid", async () => {
    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        gender: "Female",
        species: "Cat",
        weight_kg: "2.0",
        birthday: "2020-07-14",
      })
      .expect(400);
  });

  it("Should not create pet if species is invalid", async () => {
    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Meow2",
        gender: "Female",
        weight_kg: "2.0",
        birthday: "2020-07-14",
      })
      .expect(400);
  });
});
