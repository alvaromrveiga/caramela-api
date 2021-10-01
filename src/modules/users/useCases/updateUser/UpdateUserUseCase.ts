import { inject, injectable } from "tsyringe";

import {
  comparePasswordAsync,
  hashPasswordAsync,
} from "../../../../utils/bcrypt";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { IAllowedUpdatesDTO } from "../../dtos/IAllowedUpdatesDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IAccessVariableKey {
  [key: string]: string | undefined;
}

@injectable()
export class UpdateUserUseCase {
  private allowedUpdates = ["name", "email", "password", "currentPassword"];

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(user: User, updates: IAllowedUpdatesDTO): Promise<void> {
    const updateKeys = Object.keys(updates);

    this.checkValidUpdates(updateKeys);

    const hashedPasswordUpdates = (await this.checkPassword(
      user.password,
      updates
    )) as IAllowedUpdatesDTO & IAccessVariableKey;

    const newUser = user as IAccessVariableKey & User;

    updateKeys.forEach((update) => {
      newUser[update] = hashedPasswordUpdates[update];
    });
    newUser.currentPassword = undefined;

    await this.usersRepository.createAndSave(newUser);
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

    return { ...updates, password: hashNewPassword };
  }
}