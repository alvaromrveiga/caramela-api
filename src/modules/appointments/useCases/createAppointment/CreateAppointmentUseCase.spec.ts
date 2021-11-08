import { validate } from "uuid";

import { PetNotFoundError } from "../../../../shared/errors/PetNotFoundError";
import { InMemoryPetsRepository } from "../../../pets/repositories/in-memory/InMemoryPetsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryAppointmentsRepository } from "../../repositories/in-memory/InMemoryAppointmentsRepository";
import { CreateAppointmentUseCase } from "./CreateAppointmentUseCase";
import { InvalidAppointmentMotiveError } from "./errors/InvalidAppointmentMotiveError";
import { InvalidVeterinaryError } from "./errors/InvalidVeterinaryError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
let createAppointmentUseCase: CreateAppointmentUseCase;

let userId: string;
let petId: string;

describe("Create Appointment use case", () => {
  beforeEach(async () => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createAppointmentUseCase = new CreateAppointmentUseCase(
      inMemoryAppointmentsRepository,
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
      });

      petId = pet.id;
    }
  });

  it("Should create appointment", async () => {
    const appointment = await createAppointmentUseCase.execute(userId, {
      pet_id: petId,
      motive: "Anti-Rabies vaccine",
      veterinary: "Daisy",
      weight_kg: 5.5,
      vaccines: "Anti-Rabies",
      comments: "The pet is overweight",
    });

    expect(validate(appointment.id)).toBeTruthy();
    expect(validate(appointment.pet_id)).toBeTruthy();
    expect(appointment.motive).toEqual("Anti-Rabies vaccine");
    expect(appointment.veterinary).toEqual("Daisy");
    expect(appointment.weight_kg).toEqual(5.5);
    expect(appointment.vaccines).toEqual("Anti-Rabies");
    expect(appointment.comments).toEqual("The pet is overweight");
    expect(appointment.created_at).toBeInstanceOf(Date);
  });

  it("Should not create appointment if user is invalid", async () => {
    await expect(
      createAppointmentUseCase.execute("invalidUser", {
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
    ).rejects.toEqual(new PetNotFoundError());
  });

  it("Should not create appointment if pet is invalid", async () => {
    await expect(
      createAppointmentUseCase.execute(userId, {
        pet_id: "invalidPet",
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
    ).rejects.toEqual(new PetNotFoundError());
  });

  it("Should not create appointment if motive invalid", async () => {
    await expect(
      createAppointmentUseCase.execute(userId, {
        pet_id: petId,
        motive: "",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      })
    ).rejects.toEqual(new InvalidAppointmentMotiveError());
  });

  it("Should not create appointment if veterinary invalid", async () => {
    await expect(
      createAppointmentUseCase.execute(userId, {
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
