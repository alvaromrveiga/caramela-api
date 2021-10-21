import { minimumPasswordLength } from "../../../../config/password";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InvalidPasswordCreationError } from "../createUser/errors/InvalidPasswordCreationError";
import { InvalidCurrentPasswordError } from "./errors/InvalidCurrentPasswordError";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let updateUserUseCase: UpdateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Update User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    updateUserUseCase = new UpdateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  it("Should update user with password", async () => {
    let user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();

    if (user) {
      const userId = user.id;

      const response = await updateUserUseCase.execute(userId, {
        name: "UpdatedTester",
        email: "updatedTester@mail.com",
        password: "updatedPassword",
        currentPassword: "testerPa$$w0rd",
      });

      user = await inMemoryUsersRepository.findByEmail("updatedester@mail.com");

      expect(response.name).toEqual("UpdatedTester");
      expect(response.email).toEqual("updatedtester@mail.com");

      expect(user?.password).not.toEqual("updatedPassword");
      expect(user?.password).not.toEqual("testerPa$$w0rd");

      expect(response).not.toHaveProperty("currentPassword");
      expect(response).not.toHaveProperty("password");

      expect(response.id).toEqual(userId);
    }
  });

  it("Should update user without password", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();

    if (user) {
      const userId = user.id;

      const response = await updateUserUseCase.execute(userId, {
        name: "UpdatedTester",
        email: "updatedTester@mail.com",
      });

      expect(response.name).toEqual("UpdatedTester");
      expect(response.email).toEqual("updatedtester@mail.com");

      expect(response).not.toHaveProperty("password");

      expect(response.id).toEqual(userId);
    }
  });

  it("Should not update user password if no current password field", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();

    if (user) {
      await expect(
        updateUserUseCase.execute(user.id, {
          name: "UpdatedTester",
          password: "newPassword",
        })
      ).rejects.toEqual(new InvalidCurrentPasswordError());
    }
  });

  it("Should not update user password if current password is invalid", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();

    if (user) {
      await expect(
        updateUserUseCase.execute(user.id, {
          name: "UpdatedTester",
          password: "newPassword",
          currentPassword: "wrongCurrentPassword",
        })
      ).rejects.toEqual(new InvalidCurrentPasswordError());
    }
  });

  it(`Should not update if new password is less than ${minimumPasswordLength} characters`, async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      await expect(
        updateUserUseCase.execute(user.id, {
          name: "UpdatedTester",
          email: "updatedTester@mail.com",
          password: "1234567",
          currentPassword: "testerPa$$w0rd",
        })
      ).rejects.toEqual(new InvalidPasswordCreationError());
    }
  });
});
