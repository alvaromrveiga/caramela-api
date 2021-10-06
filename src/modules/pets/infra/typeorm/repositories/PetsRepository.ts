import { getRepository, Repository } from "typeorm";

import { ICreatePetDTO } from "../../../dtos/ICreatePetDTO";
import { IPetsRepository } from "../../../repositories/IPetsRepository";
import { Pet } from "../entities/Pet";

export class PetsRepository implements IPetsRepository {
  private repository: Repository<Pet>;

  constructor() {
    this.repository = getRepository(Pet);
  }

  async createAndSave(data: ICreatePetDTO): Promise<void> {
    const pet = this.repository.create(data);

    await this.repository.save(pet);
  }

  async findByUserIDAndName(
    userId: string,
    petName: string
  ): Promise<Pet | undefined> {
    return this.repository.findOne({
      where: [
        {
          user_id: userId,
          name: petName,
        },
      ],
    });
  }

  async findAllByUserID(userId: string): Promise<Pet[] | undefined> {
    return this.repository.find({ user_id: userId });
  }
}
