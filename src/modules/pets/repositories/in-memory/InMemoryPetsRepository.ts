import { ICreatePetDTO } from "../../dtos/ICreatePetDTO";
import { Pet } from "../../infra/typeorm/entities/Pet";
import { IPetsRepository } from "../IPetsRepository";

export class InMemoryPetsRepository implements IPetsRepository {
  private pets: Pet[];

  constructor() {
    this.pets = [];
  }

  async createAndSave(data: ICreatePetDTO): Promise<Pet> {
    const pet = new Pet(data);

    const petAlreadyExists = this.pets.findIndex((pet) => {
      return data.name === pet.name;
    });

    if (petAlreadyExists >= 0) {
      this.pets[petAlreadyExists] = pet;
    } else {
      this.pets.push(pet);
    }

    return pet;
  }

  async findByUserAndPetId(
    userId: string,
    petId: string
  ): Promise<Pet | undefined> {
    return this.pets.find((pet) => {
      return pet.user_id === userId && pet.id === petId;
    });
  }

  async findAllByUserID(userId: string): Promise<Pet[] | undefined> {
    return this.pets.filter((pet) => {
      return pet.user_id === userId;
    });
  }

  async delete(userId: string, petId: string): Promise<void> {
    const petIndex = this.pets.findIndex((pet) => {
      return pet.user_id === userId && pet.id === petId;
    });

    this.pets.splice(petIndex, 1);
  }
}
