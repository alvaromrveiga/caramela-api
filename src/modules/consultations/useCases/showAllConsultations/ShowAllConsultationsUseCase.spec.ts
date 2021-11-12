import { PetNotFoundError } from "../../../../shared/errors/PetNotFoundError";
import { InMemoryPetsRepository } from "../../../pets/repositories/in-memory/InMemoryPetsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryConsultationsRepository } from "../../repositories/in-memory/InMemoryConsultationsRepository";
import { ShowAllConsultationsUseCase } from "./ShowAllConsultationsUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryConsultationsRepository: InMemoryConsultationsRepository;
let showAllConsultationsUseCase: ShowAllConsultationsUseCase;

let userId: string;
let petId: string;
let otherUserPetId: string;

describe("Show All Consultations use case", () => {
  beforeEach(async () => {
    inMemoryConsultationsRepository = new InMemoryConsultationsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showAllConsultationsUseCase = new ShowAllConsultationsUseCase(
      inMemoryConsultationsRepository,
      inMemoryPetsRepository
    );

    await inMemoryUsersRepository.createAndSave({
      email: "otherTester@mail.com",
      name: "OtherTester",
      password: "testerPassword",
    });

    let user = await inMemoryUsersRepository.findByEmail(
      "othertester@mail.com"
    );

    expect(user).toBeDefined();
    if (user) {
      userId = user.id;

      const pet = await inMemoryPetsRepository.createAndSave({
        user_id: user.id,
        name: "FirstPetster",
        species: "Dog",
      });

      otherUserPetId = pet.id;

      await inMemoryConsultationsRepository.createAndSave({
        pet_id: otherUserPetId,
        motive: "Check up",
        veterinary: "Jorge",
        weight_kg: 3.0,
        comments: "All fine",
      });
    }

    await inMemoryUsersRepository.createAndSave({
      email: "tester@mail.com",
      name: "Tester",
      password: "testerPassword",
    });

    user = await inMemoryUsersRepository.findByEmail("tester@mail.com");

    expect(user).toBeDefined();
    if (user) {
      userId = user.id;

      const pet = await inMemoryPetsRepository.createAndSave({
        user_id: user.id,
        name: "Petster",
        species: "Cat",
      });

      petId = pet.id;

      await inMemoryConsultationsRepository.createAndSave({
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      });

      await inMemoryConsultationsRepository.createAndSave({
        pet_id: petId,
        motive: "Check Up",
        veterinary: "Daisy",
        weight_kg: 5.0,
        comments: "The weight is better, but still slightly over",
      });
    }
  });

  it("Should show all pet consultations", async () => {
    const consultations = await showAllConsultationsUseCase.execute(
      userId,
      petId
    );

    expect(consultations.length).toEqual(2);
    expect(consultations[0].weight_kg).toEqual(5.5);
    expect(consultations[1].weight_kg).toEqual(5.0);
  });

  it("Should not show other user pet consultations", async () => {
    await expect(
      showAllConsultationsUseCase.execute(userId, otherUserPetId)
    ).rejects.toEqual(new PetNotFoundError());
  });

  it("Should not show pet consultations if user is invalid", async () => {
    await expect(
      showAllConsultationsUseCase.execute("invalidUser", petId)
    ).rejects.toEqual(new PetNotFoundError());
  });
});
