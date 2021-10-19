import { inject, injectable } from "tsyringe";

import { getValidatedPet } from "../../../../utils/getValidatedPet";
import { validateUser } from "../../../../utils/validateUser";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IPetsRepository } from "../../repositories/IPetsRepository";

@injectable()
export class DeletePetUseCase {
  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(userId: string, petId: string): Promise<void> {
    await validateUser(userId, this.usersRepository);

    await getValidatedPet(userId, petId, this.petsRepository);

    await this.petsRepository.delete(userId, petId);
  }
}
