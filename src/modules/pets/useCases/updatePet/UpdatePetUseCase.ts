import { inject, injectable } from "tsyringe";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { getValidatedPet } from "../../../../utils/getValidatedPet";
import { getValidatedUser } from "../../../../utils/getValidatedUser";
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
      throw new ErrorWithStatus(400, "Invalid update!");
    }
  }

  private getUpdatedPet(
    pet: Pet | undefined,
    updates: IAllowedUpdatesDTO
  ): Pet {
    if (!pet) {
      throw new ErrorWithStatus(404, "Pet not found!");
    }

    return { ...pet, ...updates };
  }
}
