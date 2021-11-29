import { sign } from "jsonwebtoken";
import request from "supertest";
import { Connection } from "typeorm";

import {
  refreshTokenExpiresInDays,
  refreshTokenSecret,
} from "../../../../config/auth";
import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let refreshToken: string;

describe("Refresh Token controller", () => {
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

    const response = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
      machineInfo: "Tester Phone 127.0.0.1",
    });

    refreshToken = response.body.refresh_token;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should refresh token via body", async () => {
    const response = await request(app)
      .post("/refresh-token")
      .send({
        refreshToken,
      })
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refresh_token");
  });

  it("Should refresh token via query", async () => {
    const response = await request(app)
      .post(`/refresh-token?token=${refreshToken}`)
      .send()
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refresh_token");
  });

  it("Should refresh token via x-access-token header", async () => {
    const response = await request(app)
      .post("/refresh-token")
      .set("x-access-token", refreshToken)
      .send()
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refresh_token");
  });

  it("Should not refresh token if refresh token is invalid", async () => {
    const token = sign({}, refreshTokenSecret, {
      subject: "378ebfb8-d6bd-49c8-a143-683198f5cbb2",
      expiresIn: `${refreshTokenExpiresInDays}d`,
    });

    await request(app)
      .post("/refresh-token")
      .send({
        refreshToken: token,
      })
      .expect(400);
  });

  it("Should not refresh token if refresh token secret is invalid", async () => {
    await request(app)
      .post("/refresh-token")
      .send({
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZ" +
          "SI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      })
      .expect(500);
  });

  it("Should not refresh token with a token that was already rotated", async () => {
    // Wait 1 second to let the rotated refresh token be different from the first refresh token
    // If they are generated at the same second they will be exactly equal since the iat and exp will be the same
    await new Promise((r) => setTimeout(r, 1000));

    await request(app)
      .post("/refresh-token")
      .send({
        refreshToken,
      })
      .expect(200);

    await request(app)
      .post("/refresh-token")
      .send({
        refreshToken,
      })
      .expect(400);
  });
});
