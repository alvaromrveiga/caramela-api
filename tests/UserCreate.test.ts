import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../src/app";
import { User } from "../src/models/User";
import { UsersRepository } from "../src/repositories/UsersRepository";
import { IUserCreateCredentials } from "../src/useCases/User/CreateUserUseCase";
import { connect, resetDatabase } from "./fixtures/database";
import { getRawUsers, getUsers } from "./fixtures/users";
import UUID_RegExp from "./fixtures/UUID_Regex";
import jwt from "jsonwebtoken";

let connection: Connection;
let userOne: User;
let userTwo: User;
let rawUserOne: IUserCreateCredentials;
let rawUserTwo: IUserCreateCredentials;

beforeAll(async () => {
  connection = await connect();
  ({ rawUserOne, rawUserTwo } = getRawUsers());
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

describe("Create", () => {
  beforeEach(async () => {
    await resetDatabase();
    ({ userOne, userTwo } = await getUsers());
  });

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

  it("Should show error message if no email field", async () => {
    await request(app)
      .post("/signup")
      .send({
        name: userOne.name,
        password: rawUserOne.password,
      })
      .expect(400);
  });

  it("Should show error message if no password field", async () => {
    await request(app)
      .post("/signup")
      .send({
        name: userOne.name,
        email: userOne.email,
      })
      .expect(400);
  });
});
