import { ICreatePetDTO } from "../../dtos/ICreatePetDTO";
import { Pet } from "../../infra/typeorm/entities/Pet";
import { IPetsRepository } from "../IPetsRepository";

export class InMemoryPetsRepository implements IPetsRepository {
  private pets: Pet[];

  constructor() {
    this.pets = [];
  }

  async createAndSave(data: ICreatePetDTO): Promise<void> {
    const pet = new Pet();
    Object.assign(pet, data);

    const petAlreadyExists = this.pets.findIndex((pet) => {
      return data.name === pet.name;
    });

    if (petAlreadyExists >= 0) {
      this.pets[petAlreadyExists] = pet;
    } else {
      this.pets.push(pet);
    }
  }

  async findByUserIDAndName(
    userId: string,
    petName: string
  ): Promise<Pet | undefined> {
    return this.pets.find((pet) => {
      return pet.user_id === userId && pet.name === petName;
    });
  }

  async findAllByUserID(userId: string): Promise<Pet[] | undefined> {
    return this.pets.filter((pet) => {
      return pet.user_id === userId;
    });
  }

  async delete(userId: string, petName: string): Promise<void> {
    const petIndex = this.pets.findIndex((pet) => {
      return pet.user_id === userId && pet.name === petName;
    });

    this.pets.splice(petIndex, 1);
  }
}
