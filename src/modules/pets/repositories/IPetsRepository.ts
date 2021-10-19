import { ICreatePetDTO } from "../dtos/ICreatePetDTO";
import { Pet } from "../infra/typeorm/entities/Pet";

export interface IPetsRepository {
  createAndSave(data: ICreatePetDTO): Promise<Pet>;

  findByUserAndPetId(userId: string, petId: string): Promise<Pet | undefined>;

  findAllByUserID(userId: string): Promise<Pet[] | undefined>;

  delete(userId: string, petId: string): Promise<void>;
}
