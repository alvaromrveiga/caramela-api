import { ICreatePetDTO } from "../dtos/ICreatePetDTO";
import { Pet } from "../infra/typeorm/entities/Pet";

export interface IPetsRepository {
  createAndSave(data: ICreatePetDTO): Promise<Pet>;
}
