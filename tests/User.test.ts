import jwt from "jsonwebtoken";
import request from "supertest";
import { Connection } from "typeorm";

import { ICreateUserDTO } from "../src/modules/users/dtos/ICreateUserDTO";
import { User } from "../src/modules/users/infra/typeorm/entities/User";
import { UsersRepository } from "../src/modules/users/infra/typeorm/repositories/UsersRepository";
import { app } from "../src/shared/infra/http/app";
import { connect, resetDatabase } from "./fixtures/database";
import { getUsers, getRawUsers } from "./fixtures/users";
import UUID_RegExp from "./fixtures/UUID_Regex";

let connection: Connection;
let userOne: User;
let userTwo: User;
let rawUserOne: ICreateUserDTO;
let rawUserTwo: ICreateUserDTO;

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

describe("Users", () => {
  beforeEach(async () => {
    await resetDatabase();
    ({ userOne, userTwo } = await getUsers());
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

  describe("Login", () => {
    it("Should login user", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: userOne.email,
          password: rawUserOne.password,
        })
        .expect(200);

      expect(response.body.name).toEqual(userOne.name);
      expect(response.body).not.toContain("password");
      expect(response.body).not.toContain("id");
    });

    it("Should not login user with wrong password", async () => {
      await request(app)
        .post("/login")
        .send({
          email: userOne.email,
          password: `wrong${rawUserOne.password}`,
        })
        .expect(400);
    });
    it("Should not login user with invalid email", async () => {
      await request(app)
        .post("/login")
        .send({
          email: `wrong${userOne.email}`,
          password: rawUserOne.password,
        })
        .expect(400);
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

  describe("Delete user", () => {
    it("Should delete user", async () => {
      await request(app)
        .delete("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send({ password: rawUserOne.password })
        .expect(200);

      const user = await UsersRepository.instance.findOne({ id: userOne.id });
      expect(user).toBeUndefined();
    });

    it("Should not delete authenticated user with invalid password", async () => {
      await request(app)
        .delete("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send({ password: "wrong password" })
        .expect(400);
    });

    it("Should not delete unauthenticated user", async () => {
      await request(app)
        .delete("/users/profile")
        .send({ password: rawUserOne.password })
        .expect(401);
    });
  });

  describe("Logout user", () => {
    it("Should logout user", async () => {
      await request(app)
        .post("/users/logout")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send()
        .expect(200);

      const user = await UsersRepository.instance.findOne(userOne.id);
      expect(user?.tokens).not.toContain(userOne.tokens[0]);
    });

    it("Should not logout unauthenticated user", async () => {
      await request(app).post("/users/logout").send().expect(401);
    });

    it("Should not be able to logout twice in a row", async () => {
      await request(app)
        .post("/users/logout")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send()
        .expect(200);

      await request(app)
        .post("/users/logout")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send()
        .expect(401);
    });
  });

  describe("Logout user from all sessions", () => {
    it("Should log out user from all sessions", async () => {
      await request(app)
        .post("/users/logout-all")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send()
        .expect(200);

      const user = await UsersRepository.instance.findOne(userOne.id);

      expect(user?.tokens.length).toEqual(0);
    });

    it("Should not log out unauthenticated user from all sessions", async () => {
      await request(app).post("/users/logout-all").send().expect(401);
    });
  });

  describe("Update user", () => {
    it("Should update user", async () => {
      await request(app)
        .put("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send({
          name: `${userOne.name}Updated`,
          email: `${userOne.email}Updated`,
          password: `${rawUserOne.password}Updated`,
          currentPassword: rawUserOne.password,
        })
        .expect(200);

      const user = await UsersRepository.instance.findOne(userOne.id);
      expect(user).toMatchObject({
        name: `${userOne.name}Updated`,
        email: `${userOne.email}Updated`,
      });

      expect(user?.password).not.toEqual(`${rawUserOne.password}Updated`);

      await request(app)
        .post("/login")
        .send({
          email: `${userOne.email}Updated`,
          password: `${rawUserOne.password}Updated`,
        })
        .expect(200);
    });

    it("Should update user without current password when not changing password", async () => {
      await request(app)
        .put("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send({
          name: `${userOne.name}Updated`,
          email: `${userOne.email}Updated`,
        })
        .expect(200);
    });

    it("Should not update user with not allowed field", async () => {
      await request(app)
        .put("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send({
          id: "10841f14-4768-416d-b1ef-9d60ee87fed8",
          name: `${userOne.name}Updated`,
          email: `${userOne.email}Updated`,
          password: `${rawUserOne.password}Updated`,
          currentPassword: rawUserOne.password,
        })
        .expect(400);
    });

    it("Should not update user password with no current password", async () => {
      await request(app)
        .put("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send({
          name: `${userOne.name}Updated`,
          email: `${userOne.email}Updated`,
          password: `${rawUserOne.password}Updated`,
        })
        .expect(400);
    });

    it("Should not update user password with wrong current password", async () => {
      await request(app)
        .put("/users/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0]}`)
        .send({
          name: `${userOne.name}Updated`,
          email: `${userOne.email}Updated`,
          password: `${rawUserOne.password}Updated`,
          currentPassword: `${rawUserOne.password}Wrong`,
        })
        .expect(400);
    });

    it("Should not update unauthenticated user", async () => {
      await request(app)
        .put("/users/profile")
        .send({
          name: `${userOne.name}Updated`,
          email: `${userOne.email}Updated`,
        })
        .expect(401);
    });
  });
});
