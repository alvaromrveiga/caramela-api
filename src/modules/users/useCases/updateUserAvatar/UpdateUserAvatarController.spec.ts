import request from "supertest";
import { Connection } from "typeorm";

import { STORAGE_PROVIDER } from "../../../../config/providers";
import { LocalStorageProvider } from "../../../../shared/container/providers/StorageProvider/implementations/LocalStorageProvider";
import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/connection";

let connection: Connection;
let token: string;

describe("Update User Avatar controller", () => {
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

    const user = await request(app).post("/login").send({
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    token = user.body.token;
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("Should update user's avatar", async () => {
    const buffer = Buffer.from("some data");

    await request(app)
      .patch("/users/profile/avatar")
      .set({ Authorization: `Bearer ${token}` })
      .attach("avatar", buffer, "file.png")
      .expect(200);

    // Remove file saved on tmp folder on project root
    if (STORAGE_PROVIDER === "local") {
      const response = await request(app)
        .get("/users/profile")
        .set({ Authorization: `Bearer ${token}` })
        .send();

      const { avatar } = response.body;

      const localStorageProvider = new LocalStorageProvider();
      localStorageProvider.delete(avatar, "usersAvatars");
    }
  });

  it("Should not update user's avatar if no avatar file", async () => {
    await request(app)
      .patch("/users/profile/avatar")
      .set({ Authorization: `Bearer ${token}` })
      .attach("avatar", "")
      .expect(400);
  });

  it("Should not update user's avatar if unauthenticated", async () => {
    const buffer = Buffer.from("some data");

    await request(app)
      .patch("/users/profile/avatar")
      .attach("avatar", buffer, "file.png")
      .expect(401);
  });
});
