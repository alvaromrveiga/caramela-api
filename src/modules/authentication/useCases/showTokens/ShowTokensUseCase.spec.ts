import { validate } from "uuid";

import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { User } from "../../../users/infra/typeorm/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersTokensRepository } from "../../repositories/in-memory/InMemoryUsersTokensRepository";
import { LoginUserUseCase } from "../loginUser/LoginUserUseCase";
import { ShowTokensUseCase } from "./ShowTokensUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUsersTokensRepository: InMemoryUsersTokensRepository;
let showTokensUseCase: ShowTokensUseCase;
let loginUserUseCase: LoginUserUseCase;
let createUserUseCase: CreateUserUseCase;

let user: User | undefined;

describe("Show Tokens use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new InMemoryUsersTokensRepository();

    showTokensUseCase = new ShowTokensUseCase(
      inMemoryUsersRepository,
      inMemoryUsersTokensRepository
    );
    loginUserUseCase = new LoginUserUseCase(
      inMemoryUsersRepository,
      inMemoryUsersTokensRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: "OtherTester",
      email: "otherTester@mail.com",
      password: "testerPa$$w0rd",
    });

    await loginUserUseCase.execute(
      "otherTester@mail.com",
      "testerPa$$w0rd",
      "Other Tester PC 127.0.0.1"
    );

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

  it("Should show user logged sessions", async () => {
    expect(user).toBeDefined();

    if (user) {
      const userTokens = await showTokensUseCase.execute(user.id);

      expect(userTokens.length).toEqual(3);
      expect(userTokens[0].machine_info).toEqual("Tester PC 127.0.0.1");
      expect(validate(userTokens[0].id)).toBeTruthy();
      expect(userTokens[1].machine_info).toEqual("Tester Smartphone 127.0.0.1");
      expect(validate(userTokens[1].id)).toBeTruthy();
      expect(userTokens[2].machine_info).toEqual("Tester's Work PC 127.0.0.1");
      expect(validate(userTokens[2].id)).toBeTruthy();
    }
  });

  it("Should not show invalid user sessions", async () => {
    await expect(
      showTokensUseCase.execute("d58d3133-d8cc-430f-98ac-fa1c8687d623")
    ).rejects.toEqual(new AuthenticationError());
  });
});
