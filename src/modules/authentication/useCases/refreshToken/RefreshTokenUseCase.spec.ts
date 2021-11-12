import { sign, verify } from "jsonwebtoken";

import {
  refreshTokenExpiresInDays,
  refreshTokenSecret,
  tokenSecret,
} from "../../../../config/auth";
import { InvalidRefreshTokenError } from "../../../../shared/errors/InvalidRefreshTokenError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersTokensRepository } from "../../repositories/in-memory/InMemoryUsersTokensRepository";
import { LoginUserUseCase } from "../loginUser/LoginUserUseCase";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUsersTokensRepository: InMemoryUsersTokensRepository;
let refreshTokenUseCase: RefreshTokenUseCase;
let loginUserUseCase: LoginUserUseCase;
let createUserUseCase: CreateUserUseCase;

let refreshToken: string;

describe("Refresh Token use case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryUsersTokensRepository = new InMemoryUsersTokensRepository();

    refreshTokenUseCase = new RefreshTokenUseCase(
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

    ({ refresh_token: refreshToken } = await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd",
      "Tester PC 127.0.0.1"
    ));
  });

  it("Should refresh token", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    const token = await refreshTokenUseCase.execute(refreshToken);

    const { sub: userId } = verify(token, tokenSecret) as { sub: string };

    expect(user).toBeDefined();
    if (user) {
      expect(userId).toEqual(user.id);
    }
  });

  it("Should not refresh token if refresh token secret is invalid", async () => {
    await expect(
      refreshTokenUseCase.execute(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikp" +
          "vaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
    ).rejects.toThrowError();
  });

  it("Should not refresh token if token is invalid", async () => {
    const token = sign({}, refreshTokenSecret, {
      subject: "378ebfb8-d6bd-49c8-a143-683198f5cbb2",
      expiresIn: `${refreshTokenExpiresInDays}d`,
    });

    await expect(refreshTokenUseCase.execute(token)).rejects.toEqual(
      new InvalidRefreshTokenError()
    );
  });
});
//
