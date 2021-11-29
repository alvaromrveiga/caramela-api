import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import {
  refreshTokenSecret,
  tokenExpiresIn,
  tokenSecret,
} from "../../../../config/auth";
import { InvalidRefreshTokenError } from "../../../../shared/errors/InvalidRefreshTokenError";
import { createRefreshToken } from "../../../../shared/utils/createRefreshToken";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

interface IResponse {
  token: string;
  refresh_token: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute(refreshToken: string): Promise<IResponse> {
    const { sub: userId } = verify(refreshToken, refreshTokenSecret) as {
      sub: string;
    };

    await this.validateRefreshToken(userId, refreshToken);

    const refresh_token = await this.rotateRefreshToken(userId, refreshToken);

    const token = sign({}, tokenSecret, {
      subject: userId,
      expiresIn: tokenExpiresIn,
    });

    return { token, refresh_token };
  }

  private async validateRefreshToken(
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

  private async rotateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<string> {
    await this.usersTokensRepository.deleteByUserIdAndRefreshToken(
      userId,
      refreshToken
    );

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new InvalidRefreshTokenError();
    }

    const newRefreshToken = await createRefreshToken(
      user,
      this.usersTokensRepository
    );

    return newRefreshToken;
  }
}
