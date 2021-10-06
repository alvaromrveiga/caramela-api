import { ICreatePetDTO } from "../dtos/ICreatePetDTO";
import { Pet } from "../infra/typeorm/entities/Pet";

export interface IPetsRepository {
  createAndSave(data: ICreatePetDTO): Promise<void>;

  findByUserIDAndName(
    userId: string,
    petName: string
  ): Promise<Pet | undefined>;

  findAllByUserID(userId: string): Promise<Pet[] | undefined>;
}
