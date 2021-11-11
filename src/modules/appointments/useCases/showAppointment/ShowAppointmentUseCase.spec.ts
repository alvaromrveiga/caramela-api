import { validate } from "uuid";

import { InMemoryPetsRepository } from "../../../pets/repositories/in-memory/InMemoryPetsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryAppointmentsRepository } from "../../repositories/in-memory/InMemoryAppointmentsRepository";
import { AppointmentNotFoundError } from "./errors/AppointmentNotFoundError";
import { ShowAppointmentUseCase } from "./ShowAppointmentUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPetsRepository: InMemoryPetsRepository;
let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
let showAppointmentUseCase: ShowAppointmentUseCase;

let userId: string;
let petId: string;
let appointmentId: string;
let otherUserAppointmentId: string;

describe("Show Appointment use case", () => {
  beforeEach(async () => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryPetsRepository = new InMemoryPetsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    showAppointmentUseCase = new ShowAppointmentUseCase(
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

      petId = pet.id;

      const appointment = await inMemoryAppointmentsRepository.createAndSave({
        pet_id: petId,
        motive: "Check up",
        veterinary: "Jorge",
        weight_kg: 3.0,
        comments: "All fine",
      });
      otherUserAppointmentId = appointment.id;
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

      const appointment = await inMemoryAppointmentsRepository.createAndSave({
        pet_id: petId,
        motive: "Anti-Rabies vaccine",
        veterinary: "Daisy",
        weight_kg: 5.5,
        vaccines: "Anti-Rabies",
        comments: "The pet is overweight",
      });
      appointmentId = appointment.id;
    }
  });

  it("Should show appointment", async () => {
    const appointment = await showAppointmentUseCase.execute(
      userId,
      appointmentId
    );

    expect(validate(appointment.id)).toBeTruthy();
    expect(appointment.pet_id).toEqual(petId);
    expect(appointment.veterinary).toEqual("Daisy");
    expect(appointment.motive).toEqual("Anti-Rabies vaccine");
    expect(appointment.weight_kg).toEqual(5.5);
    expect(appointment.vaccines).toEqual("Anti-Rabies");
    expect(appointment.comments).toEqual("The pet is overweight");
    expect(appointment.created_at).toBeInstanceOf(Date);
  });

  it("Should not show invalid appointment", async () => {
    await expect(
      showAppointmentUseCase.execute(userId, "invalidAppointment")
    ).rejects.toEqual(new AppointmentNotFoundError());
  });

  it("Should not show appointment if user is invalid", async () => {
    await expect(
      showAppointmentUseCase.execute("invalidUser", appointmentId)
    ).rejects.toEqual(new AppointmentNotFoundError());
  });

  it("Should not show other user appointment", async () => {
    await expect(
      showAppointmentUseCase.execute(userId, otherUserAppointmentId)
    ).rejects.toEqual(new AppointmentNotFoundError());
  });
});
