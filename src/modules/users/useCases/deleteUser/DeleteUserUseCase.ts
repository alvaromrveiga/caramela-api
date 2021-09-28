import { inject, injectable } from "tsyringe";

import { comparePasswordAsync } from "../../../../utils/bcrypt";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
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
      throw new ErrorWithStatus(401, "Please authenticate");
    }

    const result = await comparePasswordAsync(password, user.password);

    if (!result) {
      throw new ErrorWithStatus(400, "Invalid password");
    }
  }
}
