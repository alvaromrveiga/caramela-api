import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { InvalidPasswordError } from "../../../../shared/errors/InvalidPasswordError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string, password: string): Promise<void> {
    await this.verifyPassword(id, password);

    await this.usersRepository.delete(id);
  }

  async verifyPassword(id: string, password: string): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AuthenticationError();
    }

    const result = await compare(password, user.password);

    if (!result) {
      throw new InvalidPasswordError();
    }
  }
}
