import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../src/app";
import { UsersRepository } from "../src/controllers/repositories/UsersRepository";
import { saveUser, createUsers } from "./fixtures/users";
import UUID_RegExp from "./fixtures/UUID_Regex";
import { User } from "../src/models/User";
import jwt from "jsonwebtoken";
import { connect, resetDatabase } from "./fixtures/database";

let connection: Connection;
let userOne: User;
let userTwo: User;

beforeAll(async () => {
  connection = await connect();
  ({ userOne, userTwo } = createUsers());
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

describe("Users", () => {
  beforeEach(async () => {
    await resetDatabase();
    await saveUser(userOne);
    await saveUser(userTwo);
  });

  describe("Create", () => {
    it("Should create new user", async () => {
      await request(app)
        .post("/signup")
        .send({
          name: "notEqualUserOne",
          email: "notEqualUserOne@test.com",
          password: "tester-pass",
        })
        .expect(201);

      const user =
        (await UsersRepository.instance.findOne({
          email: "notEqualUserOne@test.com",
        })) || new User();

      expect(user.id).toMatch(UUID_RegExp.UUID_RegExp);

      expect(user).toMatchObject({
        name: "notEqualUserOne",
        email: "notEqualUserOne@test.com",
      });
      expect(user.password).not.toEqual("tester-pass");
      expect(user).toHaveProperty("created_at");
    });

    it("Should not create user with email already in use", async () => {
      await request(app)
        .post("/signup")
        .send({
          email: userOne.email,
          password: "DoesNotMatter",
        })
        .expect(400);

      const usersWithEmail = await UsersRepository.instance.find({
        email: userOne.email,
      });

      expect(usersWithEmail.length).toEqual(1);
    });

    it("Should not create user with invalid password", async () => {
      await request(app)
        .post("/signup")
        .send({
          email: "notUserOneEmail@test.com",
          password: "123",
        })
        .expect(400);
    });

    it("Should not save password as plain text", async () => {
      await request(app)
        .post("/signup")
        .send({
          email: "noUser@test.com",
          password: "shouldNotBePlainText",
        })
        .expect(201);

      const user = await UsersRepository.instance.findOne({
        email: "noUser@test.com",
      });

      expect(user?.password).not.toEqual("shouldNotBePlainText");
    });

    it("Should not response user password", async () => {
      const response = await request(app)
        .post("/signup")
        .send({
          name: "Tester",
          email: "test@test.com",
          password: "StroNg_@Pa$$woRd:)",
        })
        .expect(201);

      expect(Object.keys(response.body)).not.toContain("password");
    });

    it("Should contain id information inside JsonWebToken", async () => {
      expect(process.env.JWT_SECRET).not.toBeUndefined();

      if (!process.env.JWT_SECRET) {
        throw new Error("No JWT_TOKEN on .env file");
      }

      const token = userOne.tokens[0];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };

      expect(decoded.id).toEqual(userOne.id);
    });
  });

  describe("Show", () => {
    it("Should show public user information", async () => {
      const response = await request(app)
        .get(`/users/${userOne.id}`)
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send()
        .expect(200);

      expect(Object.keys(response.body)).not.toContain("password");
      expect(Object.keys(response.body)).not.toContain("id");
      expect(Object.keys(response.body)).not.toContain("email");
      expect(Object.keys(response.body)).not.toContain("tokens");
    });

    it("Should not show public user information if not authenticated", async () => {
      await request(app).get(`/users/${userOne.id}`).send().expect(401);
    });
  });

  describe("Show self", () => {
    it("Should show private user information", async () => {
      const response = await request(app)
        .get(`/users/profile`)
        .set("Authorization", `Bearer ${userTwo.tokens[0]}`)
        .send()
        .expect(200);

      expect(response.body).toMatchObject({
        email: userTwo.email,
        name: userTwo.name,
        tokens: userTwo.tokens,
      });
    });

    it("Should not show private user information if unauthenticated", async () => {
      await request(app).get("/users/profile").send().expect(401);
    });
  });
});
