import { inject, injectable } from "tsyringe";

import { getValidatedUser } from "../../../../utils/getValidatedUser";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class LogoutUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(userId: string, loginToken: string): Promise<void> {
    const user = await getValidatedUser(userId, this.usersRepository);

    const filteredTokens = user.tokens.filter((token) => {
      return loginToken !== token;
    });

    await this.usersRepository.createAndSave({
      ...user,
      tokens: filteredTokens,
    });
  }
}
