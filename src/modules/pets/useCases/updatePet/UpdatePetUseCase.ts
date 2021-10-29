import { inject, injectable } from "tsyringe";

import { InvalidUpdateError } from "../../../../shared/errors/InvalidUpdateError";
import { PetNotFoundError } from "../../../../shared/errors/PetNotFoundError";
import { getValidatedPet } from "../../../../shared/utils/getValidatedPet";
import { getValidatedUser } from "../../../../shared/utils/getValidatedUser";
import { IAllowedUpdatesDTO } from "../../../users/dtos/IAllowedUpdatesDTO";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IAllowedPetUpdatesDTO } from "../../dtos/IAllowedPetUpdatesDTO";
import { Pet } from "../../infra/typeorm/entities/Pet";
import { IPetsRepository } from "../../repositories/IPetsRepository";

@injectable()
export class UpdatePetUseCase {
  private allowedUpdates = [
    "name",
    "gender",
    "weight_kg",
    "birthday",
    "species",
  ];

  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(
    userId: string,
    petId: string,
    updates: IAllowedPetUpdatesDTO
  ): Promise<Pet> {
    await getValidatedUser(userId, this.usersRepository);

    this.checkValidUpdates(updates);

    const pet = await getValidatedPet(userId, petId, this.petsRepository);

    const newPet = this.getUpdatedPet(pet, updates);

    await this.petsRepository.createAndSave(newPet);

    return newPet;
  }

  private checkValidUpdates(updates: IAllowedPetUpdatesDTO): void {
    const updateKeys = Object.keys(updates);

    const isValidUpdate = updateKeys.every((update) => {
      return this.allowedUpdates.includes(update);
    });

    if (!isValidUpdate) {
      throw new InvalidUpdateError();
    }
  }

  private getUpdatedPet(
    pet: Pet | undefined,
    updates: IAllowedUpdatesDTO
  ): Pet {
    if (!pet) {
      throw new PetNotFoundError();
    }

    return { ...pet, ...updates };
  }
}
