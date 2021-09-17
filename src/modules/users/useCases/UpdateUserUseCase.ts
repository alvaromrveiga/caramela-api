import { hashPasswordAsync } from "../../../utils/bcrypt";
import { ErrorWithStatus } from "../../../utils/ErrorWithStatus";
import { User } from "../infra/typeorm/entities/User";
import { UsersRepository } from "../infra/typeorm/repositories/UsersRepository";

interface IAccessVariableKey {
  [key: string]: string | undefined;
}

export interface IAllowedUpdates {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

export class UpdateUserUseCase {
  private allowedUpdates = ["name", "email", "password", "currentPassword"];

  constructor(
    private user: User & IAccessVariableKey,
    private updates: IAllowedUpdates & IAccessVariableKey
  ) {}

  execute = async () => {
    const updateKeys = Object.keys(this.updates);

    this.checkValidUpdates(updateKeys);

    await this.checkPassword();

    updateKeys.forEach((update) => {
      this.user[update] = this.updates[update];
    });

    await UsersRepository.instance.save(this.user);

    return UsersRepository.instance.getUserCredentials(this.user);
  };

  private checkValidUpdates = (updateKeys: string[]) => {
    const isValidUpdate = updateKeys.every((update) => {
      return this.allowedUpdates.includes(update);
    });

    if (!isValidUpdate) {
      throw new ErrorWithStatus(400, "Invalid update!");
    }
  };

  private checkPassword = async () => {
    if (this.updates.password) {
      if (!this.updates.currentPassword) {
        throw new ErrorWithStatus(400, "Please enter your current password");
      }

      const isValidPassword = await UsersRepository.instance.verifyPassword(
        this.updates.currentPassword,
        this.user.password
      );

      if (!isValidPassword) {
        throw new ErrorWithStatus(400, "Invalid current password");
      }

      this.updates.password = await hashPasswordAsync(this.updates.password);
    }
  };
}
