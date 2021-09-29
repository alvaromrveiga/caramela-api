import { inject, injectable } from "tsyringe";

import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class LogoutAllUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(user: User): Promise<void> {
    await this.usersRepository.createAndSave({
      ...user,
      tokens: [],
    });
  }
}
