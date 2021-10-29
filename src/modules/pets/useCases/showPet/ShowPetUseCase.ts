import { inject, injectable } from "tsyringe";

import { getValidatedPet } from "../../../../shared/utils/getValidatedPet";
import { getValidatedUser } from "../../../../shared/utils/getValidatedUser";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Pet } from "../../infra/typeorm/entities/Pet";
import { IPetsRepository } from "../../repositories/IPetsRepository";

@injectable()
export class ShowPetUseCase {
  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(userId: string, petId: string): Promise<Pet | undefined> {
    await getValidatedUser(userId, this.usersRepository);

    const pet = await getValidatedPet(userId, petId, this.petsRepository);

    return pet;
  }
}
