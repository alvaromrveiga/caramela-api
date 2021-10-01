import { validate } from "uuid";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User use case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should create user", async () => {
    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).not.toBeUndefined();

    if (user) {
      expect(validate(user.id)).toBe(true);

      expect(user).toMatchObject({
        name: "Tester",
        email: "tester@mail.com",
      });

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
    ).rejects.toEqual(new ErrorWithStatus(400, "Invalid email"));
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
    ).rejects.toEqual(new ErrorWithStatus(400, "Email already in use!"));
  });

  it("Should not create user with invalid password", async () => {
    await expect(
      createUserUseCase.execute({
        name: "Tester",
        email: "tester@mail.com",
        password: "",
      })
    ).rejects.toEqual(new ErrorWithStatus(400, "Invalid password"));
  });

  it("Should not create user with password less than 8 characters", async () => {
    await expect(
      createUserUseCase.execute({
        name: "Tester",
        email: "tester@mail.com",
        password: "1234567",
      })
    ).rejects.toEqual(
      new ErrorWithStatus(400, "Password shorter than 8 characters")
    );
  });
});
