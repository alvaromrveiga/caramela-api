import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

let otherUserPetId: string;
let petOneId: string;
let petTwoId: string;

describe("Show Pet controller", () => {
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
      .post("/users/pets")
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
      .post("/users/pets")
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
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "TicTic",
        gender: "Female",
        species: "Hamster",
        weight_kg: 0.1,
        birthday: "2021-02-20",
      });
    petTwoId = response.body.id;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should show pet", async () => {
    const response = await request(app)
      .get(`/users/pets/${petTwoId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(response.body.id).toEqual(petTwoId);
    expect(response.body.name).toEqual("TicTic");
    expect(response.body.species).toEqual("Hamster");
    expect(response.body.gender).toEqual("Female");
    expect(response.body.weight_kg).toBe("0.1");
  });

  it("Should not show if unauthenticated", async () => {
    await request(app).get(`/users/pets/${petOneId}`).send().expect(401);
  });

  it("Should not show another user's pet", async () => {
    await request(app)
      .get(`/users/pets/${otherUserPetId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(404);
  });
});
