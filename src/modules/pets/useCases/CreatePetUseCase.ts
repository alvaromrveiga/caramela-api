import { ErrorWithStatus } from "../../../utils/ErrorWithStatus";
import { ICreatePetDTO } from "../dtos/ICreatePetDTO";
import { PetsRepository } from "../infra/typeorm/repositories/PetsRepository";

export class CreatePetUseCase {
  constructor(userId: string, private body: ICreatePetDTO) {
    const bodyReference = body;
    bodyReference.user_id = userId;
    // body.user_id = userId;
  }

  execute = async () => {
    if (!this.body.name) {
      throw new ErrorWithStatus(400, "Invalid pet name");
    }

    const pet = PetsRepository.instance.create(this.body);

    await PetsRepository.instance.save(pet);

    return pet;
  };
}
