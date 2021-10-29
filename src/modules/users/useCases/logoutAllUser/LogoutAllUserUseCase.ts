import { inject, injectable } from "tsyringe";

import { getValidatedUser } from "../../../../shared/utils/getValidatedUser";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

@injectable()
export class LogoutAllUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await getValidatedUser(userId, this.usersRepository);

    await this.usersTokensRepository.deleteAllByUserId(userId);
  }
}
