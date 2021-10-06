import { inject, injectable } from "tsyringe";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { ICreatePetDTO } from "../../dtos/ICreatePetDTO";
import { IPetsRepository } from "../../repositories/IPetsRepository";

@injectable()
export class CreatePetUseCase {
  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository
  ) {}

  execute = async (data: ICreatePetDTO): Promise<void> => {
    if (!data.name) {
      throw new ErrorWithStatus(400, "Invalid pet name");
    }

    if (!data.species) {
      throw new ErrorWithStatus(400, "Please choose your pet species!");
    }

    await this.petsRepository.createAndSave(data);
  };
}
