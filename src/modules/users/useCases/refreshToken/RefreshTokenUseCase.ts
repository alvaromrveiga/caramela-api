import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import {
  refreshTokenSecret,
  tokenExpiresIn,
  tokenSecret,
} from "../../../../config/auth";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { InvalidRefreshTokenError } from "./errors/InvalidRefreshTokenError";

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute(refreshToken: string): Promise<string> {
    const { sub: userId } = verify(refreshToken, refreshTokenSecret) as {
      sub: string;
    };

    await this.validateRefreshToken(userId, refreshToken);

    const token = sign({}, tokenSecret, {
      subject: userId,
      expiresIn: tokenExpiresIn,
    });

    return token;
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const userToken =
      await this.usersTokensRepository.findByUserAndRefreshToken(
        userId,
        refreshToken
      );

    if (!userToken) {
      throw new InvalidRefreshTokenError();
    }
  }
}
