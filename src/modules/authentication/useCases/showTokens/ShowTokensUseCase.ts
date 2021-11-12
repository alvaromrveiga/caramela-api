import { inject, injectable } from "tsyringe";

import { getValidatedUser } from "../../../../shared/utils/getValidatedUser";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { UserTokens } from "../../infra/entities/UserTokens";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

@injectable()
export class ShowTokensUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute(userId: string): Promise<UserTokens[]> {
    await getValidatedUser(userId, this.usersRepository);

    const userTokens = await this.usersTokensRepository.findByUserId(userId);

    return userTokens;
  }
}
