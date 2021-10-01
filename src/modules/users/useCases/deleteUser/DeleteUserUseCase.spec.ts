import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let deleteUserUseCase: DeleteUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Delete User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    deleteUserUseCase = new DeleteUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  it("Should delete user", async () => {
    let user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).not.toBeUndefined();
    if (user) {
      await deleteUserUseCase.execute(user.id, "testerPa$$w0rd");
    }

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeUndefined();
  });

  it("Should not delete if user does not exist", async () => {
    await expect(
      deleteUserUseCase.execute("invalid_ID", "password")
    ).rejects.toEqual(new ErrorWithStatus(401, "Please authenticate"));
  });

  it("Should not delete user if password is wrong", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).not.toBeUndefined();
    if (user) {
      await expect(
        deleteUserUseCase.execute(user.id, "wrongPassword")
      ).rejects.toEqual(new ErrorWithStatus(400, "Invalid password"));
    }
  });
});
