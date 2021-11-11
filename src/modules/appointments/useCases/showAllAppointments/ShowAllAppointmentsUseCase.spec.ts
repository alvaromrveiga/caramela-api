import { PetNotFoundError } from "../../../../shared/errors/PetNotFoundError";
import { InMemoryPetsRepository } from "../../../pets/repositories/in-memory/InMemoryPetsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryAppointmentsRepository } from "../../repositories/in-memory/InMemoryAppointmentsRepository";
import { ShowAllAppointmentsUseCase } from "./ShowAllAppointmentsUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
let showAllAppointmentsUseCase: ShowAllAppointmentsUseCase;

let userId: string;
let petId: string;
let otherUserPetId: string;

describe("Show All Appointments use case", () => {
  beforeEach(async () => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showAllAppointmentsUseCase = new ShowAllAppointmentsUseCase(
      inMemoryAppointmentsRepository,
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

      await inMemoryAppointmentsRepository.createAndSave({
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

      await inMemoryAppointmentsRepository.createAndSave({
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      });

      await inMemoryAppointmentsRepository.createAndSave({
        pet_id: petId,
        motive: "Check Up",
        veterinary: "Daisy",
        weight_kg: 5.0,
        comments: "The weight is better, but still slightly over",
      });
    }
  });

  it("Should show all pet appointments", async () => {
    const appointments = await showAllAppointmentsUseCase.execute(
      userId,
      petId
    );

    expect(appointments.length).toEqual(2);
    expect(appointments[0].weight_kg).toEqual(5.5);
    expect(appointments[1].weight_kg).toEqual(5.0);
  });

  it("Should not show other user pet appointments", async () => {
    await expect(
      showAllAppointmentsUseCase.execute(userId, otherUserPetId)
    ).rejects.toEqual(new PetNotFoundError());
  });

  it("Should not show pet appointments if user is invalid", async () => {
    await expect(
      showAllAppointmentsUseCase.execute("invalidUser", petId)
    ).rejects.toEqual(new PetNotFoundError());
  });
});
