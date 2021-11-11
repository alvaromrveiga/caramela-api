import dayjs from "dayjs";
import request from "supertest";
import { Connection } from "typeorm";
import { validate } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

let petId: string;
let appointmentId: string;
let otherUserAppointmentId: string;

describe("Show Appointment controller", () => {
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
      .post("/users/pets")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: "Meow",
        gender: "Female",
        species: "Cat",
        weight_kg: 3.3,
        birthday: "2017-06-25",
      });
    petId = response.body.id;

    response = await request(app)
      .post("/appointments")
      .set({ Authorization: `Bearer ${token}` })
      .send({
        pet_id: petId,
        motive: "Check up",
        veterinary: "Jorge",
        weight_kg: 3.0,
        comments: "All fine",
      });
    otherUserAppointmentId = response.body.id;

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

    response = await request(app)
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
    appointmentId = response.body.id;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should show appointment", async () => {
    const response = await request(app)
      .get(`/appointments/${appointmentId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(200);

    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body.pet_id).toEqual(petId);
    expect(response.body.veterinary).toEqual("Daisy");
    expect(response.body.motive).toEqual("Anti-Rabies vaccine");
    expect(response.body.weight_kg).toEqual("5.5");
    expect(response.body.vaccines).toEqual("Anti-Rabies");
    expect(response.body.comments).toEqual("The pet is overweight");
    expect(dayjs(response.body.created_at).isValid()).toBeTruthy();
  });

  it("Should not show appointment if unauthenticated", async () => {
    await request(app).get(`/appointments/${appointmentId}`).send().expect(401);
  });

  it("Should not show invalid appointment", async () => {
    await request(app)
      .get(`/appointments/301c99d5-0840-42a4-9d0a-87ebda4d8c18`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(404);
  });

  it("Should not show other user appointment", async () => {
    await request(app)
      .get(`/appointments/${otherUserAppointmentId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .expect(404);
  });
});
