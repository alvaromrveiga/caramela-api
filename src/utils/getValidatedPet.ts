import { Pet } from "../modules/pets/infra/typeorm/entities/Pet";
import { IPetsRepository } from "../modules/pets/repositories/IPetsRepository";
import { ErrorWithStatus } from "./ErrorWithStatus";

export async function getValidatedPet(
  userId: string,
  petId: string,
  petsRepository: IPetsRepository
): Promise<Pet> {
  const pet = await petsRepository.findByUserAndPetId(userId, petId);

  if (!pet) {
    throw new ErrorWithStatus(404, "Pet not found!");
  }

  return pet;
}
