import { inject, injectable } from "tsyringe";

import { getValidatedUser } from "../../../../utils/getValidatedUser";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class LogoutAllUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await getValidatedUser(userId, this.usersRepository);

    await this.usersRepository.createAndSave({
      ...user,
      tokens: [],
    });
  }
}
