import { ErrorWithStatus } from "../../../utils/ErrorWithStatus";
import { PetsRepository } from "../infra/typeorm/repositories/PetsRepository";

export interface IPetCreateCredentials {
  user_id: string;
  name: string;
  gender?: string;
  weight_kg?: number;
  birthday?: Date;
}

export class CreatePetUseCase {
  constructor(userId: string, private body: IPetCreateCredentials) {
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
