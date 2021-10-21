import { inject, injectable } from "tsyringe";

import { comparePasswordAsync } from "../../../../utils/bcrypt";
import { generateJwt } from "../../../../utils/generateJwt";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { LoginError } from "./errors/LoginError";

interface IResponse {
  name: string;
  email: string;
  tokens: string[];
}

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(email: string, password: string): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new LoginError();
    }

    await this.verifyPassword(user, password);

    generateJwt(user);

    await this.usersRepository.createAndSave(user);

    const tokenResponse: IResponse = {
      name: user.name,
      email: user.email,
      tokens: user.tokens,
    };

    return tokenResponse;
  }

  private async verifyPassword(user: User, password: string): Promise<void> {
    const result = await comparePasswordAsync(password, user.password);

    if (!result) {
      throw new LoginError();
    }
  }
}
