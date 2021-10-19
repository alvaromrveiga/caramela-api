import { inject, injectable } from "tsyringe";

import { IStorageProvider } from "../../../../shared/container/providers/StorageProvider/IStorageProvider";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
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
    petId: string,
    avatarFile: string | undefined
  ): Promise<Pet> {
    if (!avatarFile) {
      throw new ErrorWithStatus(400, "Please upload an avatar file");
    }

    await validateUser(userId, this.usersRepository);

    const pet = await this.getValidatedPet(userId, petId, avatarFile);

    if (pet.avatar) {
      await this.storageProvider.delete(pet.avatar, "petsAvatars");
    }

    await this.storageProvider.save(avatarFile, "petsAvatars");

    pet.avatar = avatarFile;

    await this.petsRepository.createAndSave(pet);

    return pet;
  }

  private async getValidatedPet(
    userId: string,
    petId: string,
    avatarFile: string
  ): Promise<Pet> {
    const pet = await this.petsRepository.findByUserAndPetId(userId, petId);

    if (!pet) {
      await this.storageProvider.delete(avatarFile, "");

      throw new ErrorWithStatus(404, "Pet not found!");
    }

    return pet;
  }
}
