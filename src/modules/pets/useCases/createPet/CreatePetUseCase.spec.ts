import { validate } from "uuid";

import { AuthenticationError } from "../../../../shared/errors/AuthenticationError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryPetsRepository } from "../../repositories/in-memory/InMemoryPetsRepository";
import { CreatePetUseCase } from "./CreatePetUseCase";
import { InvalidPetNameError } from "./errors/InvalidPetNameError";
import { InvalidPetSpeciesError } from "./errors/InvalidPetSpeciesError";

let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createPetUseCase: CreatePetUseCase;

let userId: string;

describe("Create Pet use case", () => {
  beforeEach(async () => {
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createPetUseCase = new CreatePetUseCase(
      inMemoryPetsRepository,
      inMemoryUsersRepository
    );

    await inMemoryUsersRepository.createAndSave({
      email: "tester@mail.com",
      name: "Tester",
      password: "testerPassword",
    });

    const user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      userId = user.id;
    }
  });

  it("Should create pet", async () => {
    const pet = await createPetUseCase.execute({
      name: "Petster",
      user_id: userId,
      species: "Cat",
      birthday: new Date(),
      gender: "Female",
      weight_kg: 4.5,
    });

    expect(pet).toBeDefined();

    if (pet) {
      expect(pet.name).toEqual("Petster");
      expect(validate(pet.id)).toEqual(true);
      expect(validate(pet.user_id)).toEqual(true);
      expect(pet.species).toEqual("Cat");
      expect(pet.gender).toEqual("Female");
      expect(pet.weight_kg).toEqual(4.5);
      expect(pet.birthday).toBeInstanceOf(Date);
    }
  });

  it("Should not create pet with invalid user", async () => {
    await expect(
      createPetUseCase.execute({
        name: "Petster",
        user_id: "6cd3cd38-0aca-4e13-a697-cc4c0c2d7a06",
        species: "Cat",
        birthday: new Date(),
        gender: "Female",
        weight_kg: 4.5,
      })
    ).rejects.toEqual(new AuthenticationError());
  });

  it("Should not create pet with invalid name", async () => {
    await expect(
      createPetUseCase.execute({
        name: "",
        user_id: userId,
        species: "Dog",
        birthday: new Date(),
        gender: "Male",
        weight_kg: 11.3,
      })
    ).rejects.toEqual(new InvalidPetNameError());
  });

  it("Should not create pet with invalid species", async () => {
    await expect(
      createPetUseCase.execute({
        name: "Petster",
        user_id: userId,
        species: "",
        birthday: new Date(),
        gender: "Male",
        weight_kg: 11.3,
      })
    ).rejects.toEqual(new InvalidPetSpeciesError());
  });
});
