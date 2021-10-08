import { inject, injectable } from "tsyringe";

import { getValidatedPet } from "../../../../utils/getValidatedPet";
import { validateUser } from "../../../../utils/validateUser";
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

  async execute(userId: string, petName: string): Promise<Pet | undefined> {
    await validateUser(userId, this.usersRepository);

    const pet = await getValidatedPet(userId, petName, this.petsRepository);

    return pet;
  }
}
