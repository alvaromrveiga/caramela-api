import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../src/app";
import { User } from "../src/models/User";
import { connect, resetDatabase } from "./fixtures/database";
import { getUsers } from "./fixtures/users";

let connection: Connection;
let userOne: User;
let userTwo: User;

beforeAll(async () => {
  connection = await connect();
});

afterAll(async () => {
  await connection.close();
  expect(connection.isConnected).toBe(false);
});

describe("Connection", () => {
  it("Should connect to Database", () => {
    expect(connection.isConnected).toBe(true);
  });
});

describe("Pets", () => {
  beforeEach(async () => {
    await resetDatabase();
    ({ userOne, userTwo } = await getUsers());
  });

  describe("Create pet", () => {
    it("Should create pet", async () => {
      const response = await request(app)
        .post("/users/pets")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send({
          name: "Miau",
          gender: "Feminino",
          weight_kg: "2.0",
          birthday: "2020-07-14",
        })
        .expect(201);

        expect(response.body).toMatchObject({
          name: "Miau",
          gender: "Feminino",
          weight_kg: "2.0",
          birthday: "2020-07-14",
        })
    });
  });
});
