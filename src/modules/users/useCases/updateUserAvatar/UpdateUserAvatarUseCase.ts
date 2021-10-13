import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute(userId: string, avatarFile: string | undefined): Promise<void> {
    if (!avatarFile) {
      throw new ErrorWithStatus(400, "Please upload an avatar file");
    }

    const user = await this.getUser(userId);

    if (user.avatar) {
      this.storageProvider.delete(user.avatar, "usersAvatars");
    }

    await this.storageProvider.save(avatarFile, "usersAvatars");

    user.avatar = avatarFile;

    await this.usersRepository.createAndSave(user);
  }

  private async getUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }

    return user;
  }
}
