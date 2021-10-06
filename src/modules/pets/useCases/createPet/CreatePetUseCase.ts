import { inject, injectable } from "tsyringe";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ICreatePetDTO } from "../../dtos/ICreatePetDTO";
import { IPetsRepository } from "../../repositories/IPetsRepository";

@injectable()
export class CreatePetUseCase {
  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(data: ICreatePetDTO): Promise<void> {
    await this.validateCredentials(data);

    await this.petsRepository.createAndSave(data);
  }

  private async validateCredentials(data: ICreatePetDTO): Promise<void> {
    await this.validateUser(data.user_id);

    await this.validatePetName(data);

    this.validateSpecies(data.species);
  }

  private async validateUser(userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }
  }

  private async validatePetName(data: ICreatePetDTO): Promise<void> {
    if (!data.name) {
      throw new ErrorWithStatus(400, "Invalid pet name");
    }

    const petAlreadyExists = await this.petsRepository.findByUserIDAndName(
      data.user_id,
      data.name
    );

    if (petAlreadyExists) {
      throw new ErrorWithStatus(400, "You already have a pet with that name!");
    }
  }

  private validateSpecies(species: string): void {
    if (!species) {
      throw new ErrorWithStatus(400, "Please choose your pet species!");
    }
  }
}
