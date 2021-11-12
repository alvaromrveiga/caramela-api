import { validate } from "uuid";

import { PetNotFoundError } from "../../../../shared/errors/PetNotFoundError";
import { InMemoryPetsRepository } from "../../../pets/repositories/in-memory/InMemoryPetsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryConsultationsRepository } from "../../repositories/in-memory/InMemoryConsultationsRepository";
import { CreateConsultationUseCase } from "./CreateConsultationUseCase";
import { InvalidConsultationMotiveError } from "./errors/InvalidConsultationMotiveError";
import { InvalidVeterinaryError } from "./errors/InvalidVeterinaryError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryConsultationsRepository: InMemoryConsultationsRepository;
let createConsultationUseCase: CreateConsultationUseCase;

let userId: string;
let petId: string;

describe("Create Consultation use case", () => {
  beforeEach(async () => {
    inMemoryConsultationsRepository = new InMemoryConsultationsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createConsultationUseCase = new CreateConsultationUseCase(
      inMemoryConsultationsRepository,
      inMemoryPetsRepository
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

      const pet = await inMemoryPetsRepository.createAndSave({
        user_id: user.id,
        name: "Petster",
        species: "Cat",
        weight_kg: 2,
      });

      petId = pet.id;
    }
  });

  it("Should create consultation", async () => {
    const consultation = await createConsultationUseCase.execute(userId, {
      pet_id: petId,
      motive: "Anti-Rabies vaccine",
      veterinary: "Daisy",
      weight_kg: 5.5,
      vaccines: "Anti-Rabies",
      comments: "The pet is overweight",
    });

    expect(validate(consultation.id)).toBeTruthy();
    expect(validate(consultation.pet_id)).toBeTruthy();
    expect(consultation.motive).toEqual("Anti-Rabies vaccine");
    expect(consultation.veterinary).toEqual("Daisy");
    expect(consultation.weight_kg).toEqual(5.5);
    expect(consultation.vaccines).toEqual("Anti-Rabies");
    expect(consultation.comments).toEqual("The pet is overweight");
    expect(consultation.created_at).toBeInstanceOf(Date);

    const pet = await inMemoryPetsRepository.findById(petId);

    expect(pet).toBeDefined();
    if (pet) {
      expect(pet.weight_kg).toEqual(5.5);
    }
  });

  it("Should not create consultation if user is invalid", async () => {
    await expect(
      createConsultationUseCase.execute("invalidUser", {
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
    ).rejects.toEqual(new PetNotFoundError());
  });

  it("Should not create consultation if pet is invalid", async () => {
    await expect(
      createConsultationUseCase.execute(userId, {
        pet_id: "invalidPet",
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
    ).rejects.toEqual(new PetNotFoundError());
  });

  it("Should not create consultation if motive invalid", async () => {
    await expect(
      createConsultationUseCase.execute(userId, {
        pet_id: petId,
        motive: "",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
    ).rejects.toEqual(new InvalidConsultationMotiveError());
  });

  it("Should not create consultation if veterinary invalid", async () => {
    await expect(
      createConsultationUseCase.execute(userId, {
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
    ).rejects.toEqual(new InvalidVeterinaryError());
  });
});
