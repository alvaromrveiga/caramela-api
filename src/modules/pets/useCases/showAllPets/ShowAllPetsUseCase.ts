import { inject, injectable } from "tsyringe";

import { getValidatedUser } from "../../../../utils/getValidatedUser";
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
    await getValidatedUser(userId, this.usersRepository);

    const pets = await this.petsRepository.findAllByUserID(userId);

    return pets;
  }
}
