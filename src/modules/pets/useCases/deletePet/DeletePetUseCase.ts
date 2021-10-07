import { inject, injectable } from "tsyringe";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
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

  async execute(userId: string, petName: string): Promise<void> {
    await validateUser(userId, this.usersRepository);

    const pet = await this.petsRepository.findByUserIDAndName(userId, petName);

    if (!pet) {
      throw new ErrorWithStatus(404, "Pet not found!");
    }

    await this.petsRepository.delete(userId, petName);
  }
}
