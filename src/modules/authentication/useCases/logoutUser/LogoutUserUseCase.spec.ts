import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { User } from "../../../users/infra/typeorm/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersTokensRepository } from "../../repositories/in-memory/InMemoryUsersTokensRepository";
import { LoginUserUseCase } from "../loginUser/LoginUserUseCase";
import { LogoutUserUseCase } from "./LogoutUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUsersTokensRepository: InMemoryUsersTokensRepository;
let logoutUserUseCase: LogoutUserUseCase;
let loginUserUseCase: LoginUserUseCase;
let createUserUseCase: CreateUserUseCase;

let user: User | undefined;

describe("Logout User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new InMemoryUsersTokensRepository();

    logoutUserUseCase = new LogoutUserUseCase(
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
      "Tester Phone 127.0.0.1"
    );

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");
  });

  it("Should logout user", async () => {
    expect(user).toBeDefined();

    if (user) {
      let userTokens = await inMemoryUsersTokensRepository.findByUserId(
        user.id
      );

      expect(userTokens.length).toEqual(2);

      await logoutUserUseCase.execute(user.id, "Tester Phone 127.0.0.1");

      userTokens = await inMemoryUsersTokensRepository.findByUserId(user.id);

      expect(userTokens.length).toEqual(1);
    }
  });

  it("Should not logout if user is invalid", async () => {
    await expect(
      logoutUserUseCase.execute(
        "dd17a4f1-e819-4972-ae6b-abb660fc5e66",
        "Tester PC 127.0.0.1"
      )
    ).rejects.toEqual(new AuthenticationError());
  });
});
