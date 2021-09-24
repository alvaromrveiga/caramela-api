import { injectable, inject } from "tsyringe";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { ICreatePetDTO } from "../../dtos/ICreatePetDTO";
import { Pet } from "../../infra/typeorm/entities/Pet";
import { IPetsRepository } from "../../repositories/IPetsRepository";

@injectable()
export class CreatePetUseCase {
  constructor(
    @inject("PetsRepository")
    private petsRepository: IPetsRepository
  ) {}

  execute = async (data: ICreatePetDTO): Promise<Pet> => {
    if (!data.name) {
      throw new ErrorWithStatus(400, "Invalid pet name");
    }

    const pet = this.petsRepository.createAndSave(data);

    return pet;
  };
}
