import { validate } from "uuid";

import { InMemoryPetsRepository } from "../../../pets/repositories/in-memory/InMemoryPetsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryConsultationsRepository } from "../../repositories/in-memory/InMemoryConsultationsRepository";
import { ConsultationNotFoundError } from "./errors/ConsultationNotFoundError";
import { ShowConsultationUseCase } from "./ShowConsultationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryConsultationsRepository: InMemoryConsultationsRepository;
let showConsultationUseCase: ShowConsultationUseCase;

let userId: string;
let petId: string;
let consultationId: string;
let otherUserConsultationId: string;

describe("Show Consultation use case", () => {
  beforeEach(async () => {
    inMemoryConsultationsRepository = new InMemoryConsultationsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showConsultationUseCase = new ShowConsultationUseCase(
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

      petId = pet.id;

      const consultation = await inMemoryConsultationsRepository.createAndSave({
        pet_id: petId,
        motive: "Check up",
        veterinary: "Jorge",
        weight_kg: 3.0,
        comments: "All fine",
      });
      otherUserConsultationId = consultation.id;
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

      const consultation = await inMemoryConsultationsRepository.createAndSave({
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      });
      consultationId = consultation.id;
    }
  });

  it("Should show consultation", async () => {
    const consultation = await showConsultationUseCase.execute(
      userId,
      consultationId
    );

    expect(validate(consultation.id)).toBeTruthy();
    expect(consultation.pet_id).toEqual(petId);
    expect(consultation.veterinary).toEqual("Daisy");
    expect(consultation.motive).toEqual("Anti-Rabies vaccine");
    expect(consultation.weight_kg).toEqual(5.5);
    expect(consultation.vaccines).toEqual("Anti-Rabies");
    expect(consultation.comments).toEqual("The pet is overweight");
    expect(consultation.created_at).toBeInstanceOf(Date);
  });

  it("Should not show invalid consultation", async () => {
    await expect(
      showConsultationUseCase.execute(userId, "invalidConsultation")
    ).rejects.toEqual(new ConsultationNotFoundError());
  });

  it("Should not show consultation if user is invalid", async () => {
    await expect(
      showConsultationUseCase.execute("invalidUser", consultationId)
    ).rejects.toEqual(new ConsultationNotFoundError());
  });

  it("Should not show other user consultation", async () => {
    await expect(
      showConsultationUseCase.execute(userId, otherUserConsultationId)
    ).rejects.toEqual(new ConsultationNotFoundError());
  });
});
