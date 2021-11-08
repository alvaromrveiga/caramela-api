import dayjs from "dayjs";
import request from "supertest";
import { Connection } from "typeorm";
import { validate } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

let petId: string;

describe("Create Appointment controller", () => {
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

    const user = await request(app).post("/login").send({
      email: "firsttester@mail.com",
      password: "testerPa$$w0rd",
    });

    token = user.body.token;

    const response = await request(app)
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Bark",
        gender: "Male",
        species: "Dog",
        weight_kg: 12.0,
        birthday: "2018-12-18",
      });
    petId = response.body.id;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should create appointment", async () => {
    const response = await request(app)
      .post("/appointments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
      .expect(201);

    expect(validate(response.body.id)).toBeTruthy();
    expect(validate(response.body.pet_id)).toBeTruthy();
    expect(response.body.motive).toEqual("Anti-Rabies vaccine");
    expect(response.body.veterinary).toEqual("Daisy");
    expect(response.body.weight_kg).toEqual(5.5);
    expect(response.body.vaccines).toEqual("Anti-Rabies");
    expect(response.body.comments).toEqual("The pet is overweight");
    expect(dayjs(response.body.created_at).isValid()).toBeTruthy();
  });

  it("Should not create appointment if user is unauthenticated", async () => {
    await request(app)
      .post("/appointments")
      .send({
        pet_id: "76ffc9ec-c106-4a2c-8251-4b7131640446",
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
      .expect(401);
  });

  it("Should not create appointment if pet is invalid", async () => {
    await request(app)
      .post("/appointments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pet_id: "76ffc9ec-c106-4a2c-8251-4b7131640446",
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
      .expect(404);
  });

  it("Should not create appointment if motive is invalid", async () => {
    await request(app)
      .post("/appointments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pet_id: petId,
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
      .expect(400);
  });

  it("Should not create appointment if veterinary is invalid", async () => {
    await request(app)
      .post("/appointments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
      .expect(400);
  });
});
