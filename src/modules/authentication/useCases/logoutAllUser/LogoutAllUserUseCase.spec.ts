import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { User } from "../../../users/infra/typeorm/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersTokensRepository } from "../../repositories/in-memory/InMemoryUsersTokensRepository";
import { LoginUserUseCase } from "../loginUser/LoginUserUseCase";
import { LogoutAllUserUseCase } from "./LogoutAllUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUsersTokensRepository: InMemoryUsersTokensRepository;
let logoutAllUserUseCase: LogoutAllUserUseCase;
let loginUserUseCase: LoginUserUseCase;
let createUserUseCase: CreateUserUseCase;

let user: User | undefined;

describe("Logout All User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new InMemoryUsersTokensRepository();

    logoutAllUserUseCase = new LogoutAllUserUseCase(
      inMemoryUsersRepository,
      inMemoryUsersTokensRepository
    );
    loginUserUseCase = new LoginUserUseCase(
      inMemoryUsersRepository,
      inMemoryUsersTokensRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "Tester",
      email: "tester@mail.com",
      password: "testerPa$$w0rd",
    });

    await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd",
      "Tester PC 127.0.0.1"
    );

    await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd",
      "Tester Smartphone 127.0.0.1"
    );

    await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd",
      "Tester's Work PC 127.0.0.1"
    );

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");
  });

  it("Should logout user from all sessions", async () => {
    expect(user).toBeDefined();

    if (user) {
      let userTokens = await inMemoryUsersTokensRepository.findByUserId(
        user.id
      );

      expect(userTokens.length).toEqual(3);

      await inMemoryUsersTokensRepository.deleteAllByUserId(user.id);

      userTokens = await inMemoryUsersTokensRepository.findByUserId(user.id);

      expect(userTokens.length).toEqual(0);
    }
  });

  it("Should not logout user from all sessions if user is invalid", async () => {
    await expect(
      logoutAllUserUseCase.execute("dd17a4f1-e819-4972-ae6b-abb660fc5e66")
    ).rejects.toEqual(new AuthenticationError());
  });
});
