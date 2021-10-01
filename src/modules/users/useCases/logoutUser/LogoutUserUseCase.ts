import { inject, injectable } from "tsyringe";

import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class LogoutUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(user: User, loginToken: string): Promise<void> {
    const filteredTokens = user.tokens.filter((token) => {
      return loginToken !== token;
    });

    await this.usersRepository.createAndSave({
      ...user,
      tokens: filteredTokens,
    });
  }
}
