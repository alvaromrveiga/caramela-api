import { validate } from "uuid";

import { minimumPasswordLength } from "../../../../config/password";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { EmailInUseError } from "./errors/EmailInUseError";
import { InvalidEmailError } from "./errors/InvalidEmailError";
import { InvalidPasswordCreationError } from "./errors/InvalidPasswordCreationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should create user", async () => {
    const response = await createUserUseCase.execute({
      name: "Tester",
      email: "TeStER@mail.com",
      password: "testerPa$$w0rd",
    });

    expect(validate(response.id)).toBe(true);
    expect(response).toMatchObject({
      name: "Tester",
      email: "tester@mail.com",
    });
    expect(response).not.toHaveProperty("password");

    const user = await inMemoryUsersRepository.findByEmail("TESTER@mail.com");

    expect(user).toBeDefined();

    if (user) {
      expect(user.password).not.toEqual("testerPa$$w0rd");
    }
  });

  it("Should not create user with invalid email", async () => {
    await expect(
      createUserUseCase.execute({
        name: "Tester",
        email: "notValidMail",
        password: "testerPa$$w0rd",
      })
    ).rejects.toEqual(new InvalidEmailError());
  });

  it("Should not create user if email already in use", async () => {
    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    await expect(
      createUserUseCase.execute({
        name: "Tester",
        email: "tester@mail.com",
        password: "testerPa$$w0rd",
      })
    ).rejects.toEqual(new EmailInUseError());
  });

  it("Should not create user with invalid password", async () => {
    await expect(
      createUserUseCase.execute({
        name: "Tester",
        email: "tester@mail.com",
        password: "",
      })
    ).rejects.toEqual(new InvalidPasswordCreationError());
  });

  it(`Should not create user with password less than ${minimumPasswordLength} characters`, async () => {
    await expect(
      createUserUseCase.execute({
        name: "Tester",
        email: "tester@mail.com",
        password: "1234567",
      })
    ).rejects.toEqual(new InvalidPasswordCreationError());
  });
});
