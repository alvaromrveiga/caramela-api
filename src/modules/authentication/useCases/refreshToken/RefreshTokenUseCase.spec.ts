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

    ({ refresh_token: refreshToken } = await loginUserUseCase.execute(
      "tester@mail.com",
      "testerPa$$w0rd",
      "Tester PC 127.0.0.1"
    ));
  });

  it("Should refresh token and rotate refresh_token", async () => {
    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    // Wait 1 second to let the rotated refresh token be different from the first refresh token
    // If they are generated at the same second they will be exactly equal since the iat and exp will be the same
    await new Promise((r) => setTimeout(r, 1000));

    const tokens = await refreshTokenUseCase.execute(refreshToken);

    expect(
      await inMemoryUsersTokensRepository.findByRefreshToken(refreshToken)
    ).toBeUndefined();

    expect(
      await inMemoryUsersTokensRepository.findByRefreshToken(
        tokens.refresh_token
      )
    ).toBeDefined();

    let { sub: userId } = verify(tokens.token, tokenSecret) as {
      sub: string;
    };

    expect(user).toBeDefined();
    if (user) {
      expect(userId).toEqual(user.id);
    }

    ({ sub: userId } = verify(tokens.refresh_token, refreshTokenSecret) as {
      sub: string;
    });

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

  it("Should not refresh token with a token that was already rotated", async () => {
    // Wait 1 second to let the rotated refresh token be different from the first refresh token
    // If they are generated at the same second they will be exactly equal since the iat and exp will be the same
    await new Promise((r) => setTimeout(r, 1000));

    await refreshTokenUseCase.execute(refreshToken);

    await expect(refreshTokenUseCase.execute(refreshToken)).rejects.toEqual(
      new InvalidRefreshTokenError()
    );
  });
});
