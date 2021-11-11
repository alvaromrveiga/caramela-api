import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

let petId: string;
let otherUserPetId: string;

describe("Show All Appointments controller", () => {
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

    let user = await request(app).post("/login").send({
      email: "othertester@mail.com",
      password: "testerPa$$w0rd",
    });

    token = user.body.token;

    let response = await request(app)
      .post("/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Meow",
        gender: "Female",
        species: "Cat",
        weight_kg: 3.3,
        birthday: "2017-06-25",
      });
    otherUserPetId = response.body.id;

    await request(app)
      .post("/appointments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pet_id: otherUserPetId,
        motive: "Check up",
        veterinary: "Jorge",
        weight_kg: 3.0,
        comments: "All fine",
      });

    await request(app).post("/signup").send({
      name: "FirstTester",
      email: "firsttester@mail.com",
      password: "testerPa$$w0rd",
    });

    user = await request(app).post("/login").send({
      email: "firsttester@mail.com",
      password: "testerPa$$w0rd",
    });

    token = user.body.token;

    response = await request(app)
      .post("/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Bark",
        gender: "Male",
        species: "Dog",
        weight_kg: 12.0,
        birthday: "2018-12-18",
      });
    petId = response.body.id;

    await request(app)
      .post("/appointments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      });

    await request(app)
      .post("/appointments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pet_id: petId,
        motive: "Check Up",
        veterinary: "Daisy",
        weight_kg: 5.0,
        comments: "The weight is better, but still slightly over",
      });
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should show all pet appointments", async () => {
    const response = await request(app)
      .get(`/pets/${petId}/appointments`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(response.body.length).toEqual(2);
  });

  it("Should not show other user pet appointments", async () => {
    await request(app)
      .get(`/pets/${otherUserPetId}/appointments`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(404);
  });

  it("Should not show user pet appointments if unauthenticated", async () => {
    await request(app).get(`/pets/${petId}/appointments`).send().expect(401);
  });
});
