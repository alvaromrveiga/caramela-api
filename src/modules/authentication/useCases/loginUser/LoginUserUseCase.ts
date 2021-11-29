import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { tokenExpiresIn, tokenSecret } from "../../../../config/auth";
import { createRefreshToken } from "../../../../shared/utils/createRefreshToken";
import { User } from "../../../users/infra/typeorm/entities/User";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { LoginError } from "./errors/LoginError";

interface IResponse {
  name: string;
  email: string;
  token: string;
  refresh_token: string;
}

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute(
    email: string,
    password: string,
    machineInfo?: string
  ): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new LoginError();
    }

    await this.verifyPassword(user, password);

    const { token, refresh_token } = await this.generateTokens(
      user,
      machineInfo
    );

    const tokenResponse: IResponse = {
      name: user.name,
      email: user.email,
      token,
      refresh_token,
    };

    return tokenResponse;
  }

  private async verifyPassword(user: User, password: string): Promise<void> {
    const result = await compare(password, user.password);

    if (!result) {
      throw new LoginError();
    }
  }

  private async generateTokens(
    user: User,
    machineInfo?: string
  ): Promise<{
    token: string;
    refresh_token: string;
  }> {
    const token = jwt.sign({}, tokenSecret, {
      subject: user.id,
      expiresIn: tokenExpiresIn,
    });

    await this.deleteTokenIfMachineAlreadyLogged(user.id, machineInfo);

    const refresh_token = await createRefreshToken(
      user,
      this.usersTokensRepository,
      machineInfo
    );

    return { token, refresh_token };
  }

  private async deleteTokenIfMachineAlreadyLogged(
    userId: string,
    machineInfo?: string
  ): Promise<void> {
    if (machineInfo) {
      const userToken =
        await this.usersTokensRepository.findByUserAndMachineInfo(
          userId,
          machineInfo
        );

      if (userToken) {
        await this.usersTokensRepository.deleteById(userToken.id);
      }
    }
  }
}
