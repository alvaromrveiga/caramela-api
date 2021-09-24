import { getRepository, Repository } from "typeorm";

import { ICreatePetDTO } from "../../../dtos/ICreatePetDTO";
import { Pet } from "../entities/Pet";

export class PetsRepository {
  private repository: Repository<Pet>;

  constructor() {
    this.repository = getRepository(Pet);
  }

  async createAndSave(data: ICreatePetDTO): Promise<Pet> {
    const pet = this.repository.create(data);

    await this.repository.save(pet);

    return pet;
  }
}
