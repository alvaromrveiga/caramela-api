import { inject, injectable } from "tsyringe";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Pet } from "../../infra/typeorm/entities/Pet";
import { IPetsRepository } from "../../repositories/IPetsRepository";

@injectable()
export class ShowAllPetsUseCase {
  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(userId: string): Promise<Pet[] | undefined> {
    await this.validateUser(userId);

    const pets = await this.petsRepository.findAllByUserID(userId);

    return pets;
  }

  private async validateUser(userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }
  }
}
