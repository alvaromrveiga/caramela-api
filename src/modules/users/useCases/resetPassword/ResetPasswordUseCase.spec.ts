import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { resetPasswordTokenExpiresInHours } from "../../../../config/auth";
import { minimumPasswordLength } from "../../../../config/password";
import { getResetPasswordTokenSecret } from "../../../../shared/utils/getResetPasswordTokenSecret";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InvalidPasswordCreationError } from "../createUser/errors/InvalidPasswordCreationError";
import { UserNotFoundError } from "../showPublicUser/errors/UserNotFoundError";
import { InvalidTokenError } from "./errors/InvalidTokenError";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let resetPasswordUseCase: ResetPasswordUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Reset Password use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    resetPasswordUseCase = new ResetPasswordUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  it("Should reset user password", async () => {
    let user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

      const token = sign({}, resetPasswordTokenSecret, {
        subject: user.email,
        expiresIn: `${resetPasswordTokenExpiresInHours}h`,
      });

      await resetPasswordUseCase.execute(user.id, token, "newTesterPa$$word");
    }

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      expect(await compare("testerPa$$w0rd", user.password)).toBeFalsy();
      expect(await compare("newTesterPa$$word", user.password)).toBeTruthy();
    }
  });

  it(`Should not reset user password if new password is fewer than ${minimumPasswordLength}`, async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

      const token = sign({}, resetPasswordTokenSecret, {
        subject: user.email,
        expiresIn: `${resetPasswordTokenExpiresInHours}h`,
      });

      await expect(
        resetPasswordUseCase.execute(user.id, token, "1234567")
      ).rejects.toEqual(new InvalidPasswordCreationError());
    }
  });

  it("Should not reset password if user is invalid", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

      const token = sign({}, resetPasswordTokenSecret, {
        subject: user.email,
        expiresIn: `${resetPasswordTokenExpiresInHours}h`,
      });

      await expect(
        resetPasswordUseCase.execute("invalidUser", token, "newTesterPa$$word")
      ).rejects.toEqual(new UserNotFoundError());
    }
  });

  it("Should not reset password if password was already reset (invalid token)", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

      const token = sign({}, resetPasswordTokenSecret, {
        subject: user.email,
        expiresIn: `${resetPasswordTokenExpiresInHours}h`,
      });

      await resetPasswordUseCase.execute(user.id, token, "newTesterPa$$word");

      await expect(
        resetPasswordUseCase.execute(user.id, token, "brandNewTesterPa$$word")
      ).rejects.toThrowError();
    }
  });

  it("Should not reset password if email was modified", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

      const token = sign({}, resetPasswordTokenSecret, {
        subject: "another email",
        expiresIn: `${resetPasswordTokenExpiresInHours}h`,
      });

      await expect(
        resetPasswordUseCase.execute(user.id, token, "newTesterPa$$word")
      ).rejects.toEqual(new InvalidTokenError());
    }
  });

  it("Should not reset password if token has expired", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);

      const token = sign({}, resetPasswordTokenSecret, {
        subject: "another email",
        expiresIn: `1`,
      });

      setTimeout(function wait() {
        // Wait to make sure the token will expire
      }, 1);

      await expect(
        resetPasswordUseCase.execute(user.id, token, "newTesterPa$$word")
      ).rejects.toThrowError();
    }
  });
});
