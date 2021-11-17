import { verify } from "jsonwebtoken";

import { refreshTokenSecret, tokenSecret } from "../../../../config/auth";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersTokensRepository } from "../../repositories/in-memory/InMemoryUsersTokensRepository";
import { LoginError } from "./errors/LoginError";
import { LoginUserUseCase } from "./LoginUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUsersTokensRepository: InMemoryUsersTokensRepository;
let loginUserUseCase: LoginUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Login User use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new InMemoryUsersTokensRepository();

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
  });

  it("Should login user", async () => {
    const loginResponse = await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd",
      "Tester PC 127.0.0.1"
    );

    expect(loginResponse.name).toEqual("Tester");
    expect(loginResponse.email).toEqual("tester@mail.com");

    const { sub: idFromToken } = verify(loginResponse.token, tokenSecret);
    const { sub: idFromRefreshToken } = verify(
      loginResponse.refresh_token,
      refreshTokenSecret
    );

    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      expect(idFromToken).toEqual(user.id);
      expect(idFromRefreshToken).toEqual(user.id);

      let userTokens = await inMemoryUsersTokensRepository.findByUserId(
        user.id
      );

      expect(userTokens.length).toEqual(1);

      await loginUserUseCase.execute(
        "tester@mail.com",
        "testerPa$$w0rd",
        "Tester Phone 127.0.0.1"
      );

      userTokens = await inMemoryUsersTokensRepository.findByUserId(user.id);

      expect(userTokens.length).toEqual(2);
    }
  });

  it("Should login user without passing machineInfo", async () => {
    const loginResponse = await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd"
    );

    expect(loginResponse.name).toEqual("Tester");
    expect(loginResponse.email).toEqual("tester@mail.com");

    verify(loginResponse.token, tokenSecret);
    verify(loginResponse.refresh_token, refreshTokenSecret);
  });

  it("Should not login user if email is wrong", async () => {
    await expect(
      loginUserUseCase.execute(
        "wrongEmail",
        "testerPa$$w0rd",
        "Tester PC 127.0.0.1"
      )
    ).rejects.toEqual(new LoginError());
  });

  it("Should not login user if password is wrong", async () => {
    await expect(
      loginUserUseCase.execute(
        "tester@mail.com",
        "wrongPassword",
        "Tester PC 127.0.0.1"
      )
    ).rejects.toEqual(new LoginError());
  });
});
