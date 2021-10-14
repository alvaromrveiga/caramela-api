import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { getValidatedPet } from "../../../../utils/getValidatedPet";
import { validateUser } from "../../../../utils/validateUser";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Pet } from "../../infra/typeorm/entities/Pet";
import { IPetsRepository } from "../../repositories/IPetsRepository";

@injectable()
export class UpdatePetAvatarUseCase {
  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute(
    userId: string,
    petName: string,
    avatarFile: string | undefined
  ): Promise<Pet> {
    if (!avatarFile) {
      throw new ErrorWithStatus(400, "Please upload an avatar file");
    }

    await validateUser(userId, this.usersRepository);

    const pet = await getValidatedPet(userId, petName, this.petsRepository);

    if (pet.avatar) {
      await this.storageProvider.delete(pet.avatar, "petsAvatars");
    }

    await this.storageProvider.save(avatarFile, "petsAvatars");

    pet.avatar = avatarFile;

    await this.petsRepository.createAndSave(pet);

    return pet;
  }
}
