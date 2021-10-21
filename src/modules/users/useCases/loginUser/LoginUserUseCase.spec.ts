import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { LoginError } from "./errors/LoginError";
import { LoginUserUseCase } from "./LoginUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let loginUserUseCase: LoginUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Delete User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    loginUserUseCase = new LoginUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });
  });

  it("Should login user", async () => {
    const user = await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd"
    );

    expect(user.name).toEqual("Tester");
    expect(user.email).toEqual("tester@mail.com");
    expect(user.tokens.length).toEqual(1);
  });

  it("Should not login user if email is wrong", async () => {
    await expect(
      loginUserUseCase.execute("wrongEmail", "testerPa$$w0rd")
    ).rejects.toEqual(new LoginError());
  });

  it("Should not login user if password is wrong", async () => {
    await expect(
      loginUserUseCase.execute("tester@mail.com", "wrongPassword")
    ).rejects.toEqual(new LoginError());
  });
});
