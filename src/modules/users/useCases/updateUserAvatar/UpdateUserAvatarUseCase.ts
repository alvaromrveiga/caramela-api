import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { getValidatedUser } from "../../../../utils/getValidatedUser";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute(
    userId: string,
    avatarFile: string | undefined
  ): Promise<string> {
    if (!avatarFile) {
      throw new ErrorWithStatus(400, "Please upload an avatar file");
    }

    const user = await getValidatedUser(userId, this.usersRepository);

    if (user.avatar) {
      this.storageProvider.delete(user.avatar, "usersAvatars");
    }

    await this.storageProvider.save(avatarFile, "usersAvatars");

    user.avatar = avatarFile;

    await this.usersRepository.createAndSave(user);

    return avatarFile;
  }
}
