import { inject, injectable } from "tsyringe";

import { getValidatedUser } from "../../../../shared/utils/getValidatedUser";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

@injectable()
export class LogoutUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute(userId: string, machineInfo: string): Promise<void> {
    await getValidatedUser(userId, this.usersRepository);

    const refreshToken =
      await this.usersTokensRepository.findByUserAndMachineInfo(
        userId,
        machineInfo
      );

    if (refreshToken) {
      await this.usersTokensRepository.deleteById(refreshToken.id);
    }
  }
}
