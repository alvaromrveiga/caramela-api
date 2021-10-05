import { ICreatePetDTO } from "../dtos/ICreatePetDTO";

export interface IPetsRepository {
  createAndSave(data: ICreatePetDTO): Promise<void>;
}
