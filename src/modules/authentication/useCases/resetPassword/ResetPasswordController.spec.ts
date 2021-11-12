import { sign } from "jsonwebtoken";
import request from "supertest";
import { Connection } from "typeorm";

import { resetPasswordTokenExpiresInHours } from "../../../../config/auth";
import { minimumPasswordLength } from "../../../../config/password";
import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";
import { getResetPasswordTokenSecret } from "../../../../shared/utils/getResetPasswordTokenSecret";
import { User } from "../../../users/infra/typeorm/entities/User";
import { UsersRepository } from "../../../users/infra/typeorm/repositories/UsersRepository";

let connection: Connection;
let user: User;
let token: string;

describe("Reset Password controller", () => {
  beforeAll(async () => {
    if (!connection) {
      connection = await createConnection();
    }
  });

  beforeEach(async () => {
    await connection.runMigrations();

    await request(app).post("/signup").send({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    const usersRepository = new UsersRepository();
    const findUser = await usersRepository.findByEmail("tester@mail.com");

    expect(findUser).toBeDefined();
    if (findUser) {
      user = findUser;
      const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

      token = sign({}, resetPasswordTokenSecret, {
        subject: user.email,
        expiresIn: `${resetPasswordTokenExpiresInHours}h`,
      });
    }
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should reset user password", async () => {
    await request(app)
      .post(`/resetpassword/${user.id}/${token}`)
      .send({
        newPassword: "newTesterPa$$w0rd",
      })
      .expect(200);
  });

  it(`Should not reset user password if new password is fewer than ${minimumPasswordLength}`, async () => {
    await request(app)
      .post(`/resetpassword/${user.id}/${token}`)
      .send({
        newPassword: "1234567",
      })
      .expect(400);
  });

  it("Should not reset password if user is invalid", async () => {
    await request(app)
      .post(`/resetpassword/1dba91a6-6271-491b-b780-e0445bb66574/${token}`)
      .send({
        newPassword: "newTesterPa$$w0rd",
      })
      .expect(404);
  });

  it("Should not reset password if password was already reset (invalid token)", async () => {
    await request(app)
      .post(`/resetpassword/${user.id}/${token}`)
      .send({
        newPassword: "newTesterPa$$w0rd",
      })
      .expect(200);

    await request(app)
      .post(`/resetpassword/${user.id}/${token}`)
      .send({
        newPassword: "brandNewTesterPa$$w0rd",
      })
      .expect(500);
  });

  it("Should not reset password if token has expired", async () => {
    const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

    token = sign({}, resetPasswordTokenSecret, {
      subject: user.email,
      expiresIn: `1`,
    });

    setTimeout(function wait() {
      // Wait to make sure the token will expire
    }, 1);

    await request(app)
      .post(`/resetpassword/${user.id}/${token}`)
      .send({
        newPassword: "newTesterPa$$w0rd",
      })
      .expect(500);
  });

  it("Should not reset password if email was modified", async () => {
    const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

    token = sign({}, resetPasswordTokenSecret, {
      subject: "modifiedEmail@mail.com",
      expiresIn: `${resetPasswordTokenExpiresInHours}h`,
    });

    await request(app)
      .post(`/resetpassword/${user.id}/${token}`)
      .send({
        newPassword: "newTesterPa$$w0rd",
      })
      .expect(500);
  });
});
