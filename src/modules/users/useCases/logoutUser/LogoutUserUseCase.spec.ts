import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { User } from "../../infra/typeorm/entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { LoginUserUseCase } from "../loginUser/LoginUserUseCase";
import { LogoutUserUseCase } from "./LogoutUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let logoutUserUseCase: LogoutUserUseCase;
let loginUserUseCase: LoginUserUseCase;
let createUserUseCase: CreateUserUseCase;

let user: User | undefined;
let tokens: string[];

describe("Logout User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    logoutUserUseCase = new LogoutUserUseCase(inMemoryUsersRepository);
    loginUserUseCase = new LoginUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    ({ tokens } = await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd"
    ));

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");
  });

  it("Should logout user", async () => {
    expect(user).not.toBeUndefined();

    if (user) {
      await logoutUserUseCase.execute(user.id, tokens[0]);
    }

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user?.tokens.length).toEqual(0);
  });

  it("Should not logout if user is invalid", async () => {
    await expect(
      logoutUserUseCase.execute(
        "dd17a4f1-e819-4972-ae6b-abb660fc5e66",
        tokens[0]
      )
    ).rejects.toEqual(new AuthenticationError());
  });
});
