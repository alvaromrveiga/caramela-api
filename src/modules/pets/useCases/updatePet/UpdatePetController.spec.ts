import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let tokens: string[];

describe("Update Pet controller", () => {
  beforeAll(async () => {
    if (!connection) {
      connection = await createConnection();
      await connection.runMigrations();
    }

    await request(app).post("/signup").send({
      name: "FirstTester",
      email: "firsttester@mail.com",
      password: "testerPa$$w0rd",
    });

    let user = await request(app).post("/login").send({
      email: "firsttester@mail.com",
      password: "testerPa$$w0rd",
    });

    tokens = user.body.tokens;

    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        name: "Bark",
        gender: "Male",
        species: "Dog",
        weight_kg: 12.0,
        birthday: "2018-12-18",
      });

    await request(app).post("/signup").send({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    user = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    tokens = user.body.tokens;

    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        name: "Meow",
        gender: "Female",
        species: "Cat",
        weight_kg: 2.0,
        birthday: "2020-07-14",
      });

    await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        name: "TicTic",
        gender: "Female",
        species: "Hamster",
        weight_kg: 0.1,
        birthday: "2021-02-20",
      });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not update pet if unauthenticated", async () => {
    await request(app)
      .put("/users/pets/Meow")
      .send({
        name: "Miau",
        weight_kg: 2.5,
        species: "Breedless Cat",
        birthday: new Date("2014-12-25"),
        gender: "Female",
      })
      .expect(401);
  });

  it("Should not update other user's pet", async () => {
    await request(app)
      .put("/users/pets/Bark")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        name: "Miau",
        weight_kg: 2.5,
        species: "Breedless Cat",
        birthday: new Date("2014-12-25"),
        gender: "Female",
      })
      .expect(404);
  });

  it("Should not update pet with invalid fields", async () => {
    await request(app)
      .put("/users/pets/Bark")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        id: "bf467e4f-c0aa-4b62-9d98-cb66cb2f8d17",
        name: "Miau",
        weight_kg: 2.5,
        species: "Breedless Cat",
        birthday: new Date("2014-12-25"),
        gender: "Female",
      })
      .expect(400);
  });

  it("Should update pet", async () => {
    const response = await request(app)
      .put("/users/pets/Meow")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .send({
        name: "Miau",
        weight_kg: 2.5,
        species: "Breedless Cat",
        birthday: new Date("2014-12-25"),
        gender: "Female",
      })
      .expect(200);

    expect(response.body.name).toEqual("Miau");
    expect(response.body.gender).toEqual("Female");
    expect(response.body.weight_kg).toEqual(2.5);
    expect(response.body.species).toEqual("Breedless Cat");
  });
});
