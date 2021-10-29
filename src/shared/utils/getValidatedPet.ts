import { Pet } from "../../modules/pets/infra/typeorm/entities/Pet";
import { IPetsRepository } from "../../modules/pets/repositories/IPetsRepository";
import { PetNotFoundError } from "../errors/PetNotFoundError";

export async function getValidatedPet(
  userId: string,
  petId: string,
  petsRepository: IPetsRepository
): Promise<Pet> {
  const pet = await petsRepository.findByUserAndPetId(userId, petId);

  if (!pet) {
    throw new PetNotFoundError();
  }

  return pet;
}
