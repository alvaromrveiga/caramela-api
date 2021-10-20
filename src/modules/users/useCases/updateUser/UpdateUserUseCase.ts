import { inject, injectable } from "tsyringe";

import {
  comparePasswordAsync,
  hashPasswordAsync,
} from "../../../../utils/bcrypt";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { getValidatedUser } from "../../../../utils/getValidatedUser";
import { IAllowedUpdatesDTO } from "../../dtos/IAllowedUpdatesDTO";
import { IPrivateUserCredentialsDTO } from "../../dtos/IPrivateUserCredentialsDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class UpdateUserUseCase {
  private allowedUpdates = ["name", "email", "password", "currentPassword"];

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(
    userId: string,
    updates: IAllowedUpdatesDTO
  ): Promise<IPrivateUserCredentialsDTO> {
    const updateKeys = Object.keys(updates);

    this.checkValidUpdates(updateKeys);

    const user = await getValidatedUser(userId, this.usersRepository);

    const hashedPasswordUpdates = await this.checkPassword(
      user.password,
      updates
    );

    const newUser = this.getUpdatedUser(user, hashedPasswordUpdates);

    await this.usersRepository.createAndSave(newUser);

    return {
      id: newUser.id,
      avatar: newUser.avatar,
      email: newUser.email,
      name: newUser.name,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
      tokens: newUser.tokens,
    };
  }

  private checkValidUpdates = (updateKeys: string[]) => {
    const isValidUpdate = updateKeys.every((update) => {
      return this.allowedUpdates.includes(update);
    });

    if (!isValidUpdate) {
      throw new ErrorWithStatus(400, "Invalid update!");
    }
  };

  private async checkPassword(
    password: string,
    updates: IAllowedUpdatesDTO
  ): Promise<IAllowedUpdatesDTO> {
    if (!updates.password) {
      return updates;
    }

    if (!updates.currentPassword) {
      throw new ErrorWithStatus(400, "Please enter your current password");
    }

    const isValidPassword = await comparePasswordAsync(
      updates.currentPassword,
      password
    );

    if (!isValidPassword) {
      throw new ErrorWithStatus(400, "Invalid current password");
    }

    const hashNewPassword = await hashPasswordAsync(updates.password);

    this.deleteUpdatesCurrentPassword(updates);

    return { ...updates, password: hashNewPassword };
  }

  private getUpdatedUser(user: User, updates: IAllowedUpdatesDTO): User {
    if (updates.email) {
      return { ...user, ...updates, email: updates.email.toLowerCase() };
    }

    return { ...user, ...updates };
  }

  private deleteUpdatesCurrentPassword(updates: IAllowedUpdatesDTO): void {
    const updatesReference = updates;
    delete updatesReference.currentPassword;
  }
}
