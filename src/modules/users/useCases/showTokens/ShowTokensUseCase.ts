import { inject, injectable } from "tsyringe";

import { getValidatedUser } from "../../../../shared/utils/getValidatedUser";
import { UserTokens } from "../../../authentication/infra/entities/UserTokens";
import { IUsersTokensRepository } from "../../../authentication/repositories/IUsersTokensRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";

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
