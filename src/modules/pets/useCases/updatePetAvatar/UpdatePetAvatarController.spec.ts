import request from "supertest";
import { Connection } from "typeorm";

import { LocalStorageProvider } from "../../../../shared/container/providers/StorageProvider/implementations/LocalStorageProvider";
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

  it("Should update pet avatar", async () => {
    const buffer = Buffer.from("some data");

    const response = await request(app)
      .patch("/users/pets/TicTic/avatar")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .attach("avatar", buffer, "testFile.png")
      .expect(200);

    expect(response.body.avatar).toContain("testFile.png");
    expect(response.body.name).toEqual("TicTic");

    // Remove file saved on tmp folder on project root
    if (process.env.STORAGE === "local") {
      const localStorageProvider = new LocalStorageProvider();
      localStorageProvider.delete(response.body.avatar, "petsAvatars");
    }
  });

  it("Should not update pet avatar if file is invalid", async () => {
    await request(app)
      .patch("/users/pets/FiuFiu/avatar")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .attach("avatar", "")
      .expect(400);
  });

  it("Should not update pet avatar if unauthenticated", async () => {
    const buffer = Buffer.from("some data");

    await request(app)
      .patch("/users/pets/FiuFiu/avatar")
      .attach("avatar", buffer, "testFile.png")
      .expect(401);
  });

  it("Should not update other user's pet avatar", async () => {
    const buffer = Buffer.from("some data");

    await request(app)
      .patch("/users/pets/Bark/avatar")
      .set({ Authorization: `Bearer ${tokens[0]}` })
      .attach("avatar", buffer, "testFile.png")
      .expect(404);
  });
});
