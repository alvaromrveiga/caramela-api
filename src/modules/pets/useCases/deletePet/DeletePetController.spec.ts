import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

let otherUserPetId: string;
let petOneId: string;
// let petTwoId: string;

describe("Delete Pet controller", () => {
  beforeAll(async () => {
    if (!connection) {
      connection = await createConnection();
    }
  });

  beforeEach(async () => {
    await connection.runMigrations();

    await request(app).post("/signup").send({
      name: "FirstTester",
      email: "firsttester@mail.com",
      password: "testerPa$$w0rd",
    });

    let user = await request(app).post("/login").send({
      email: "firsttester@mail.com",
      password: "testerPa$$w0rd",
    });

    token = user.body.token;

    let response = await request(app)
      .post("/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Bark",
        gender: "Male",
        species: "Dog",
        weight_kg: 12.0,
        birthday: "2018-12-18",
      });
    otherUserPetId = response.body.id;

    await request(app).post("/signup").send({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    user = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    token = user.body.token;

    response = await request(app)
      .post("/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Meow",
        gender: "Female",
        species: "Cat",
        weight_kg: 2.0,
        birthday: "2020-07-14",
      });
    petOneId = response.body.id;

    response = await request(app)
      .post("/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "TicTic",
        gender: "Female",
        species: "Hamster",
        weight_kg: 0.1,
        birthday: "2021-02-20",
      });
    // petTwoId = response.body.id;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should not delete pet if unauthenticated", async () => {
    await request(app).delete(`/pets/${petOneId}`).send().expect(401);
  });

  it("Should not delete another user's pet", async () => {
    await request(app)
      .delete(`/pets/${otherUserPetId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(404);
  });

  it("Should delete pet", async () => {
    await request(app)
      .delete(`/pets/${petOneId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    const response = await request(app)
      .get("/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send();

    expect(response.body.length).toEqual(1);
  });
});
