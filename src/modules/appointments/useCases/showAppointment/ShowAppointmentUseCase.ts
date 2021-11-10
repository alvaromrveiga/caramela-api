import { inject, injectable } from "tsyringe";

import { IPetsRepository } from "../../../pets/repositories/IPetsRepository";
import { Appointment } from "../../infra/typeorm/entities/Appointment";
import { IAppointmentsRepository } from "../../repositories/IAppointmentsRepository";
import { AppointmentNotFoundError } from "./errors/AppointmentNotFoundError";

@injectable()
export class ShowAppointmentUseCase {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,

    @inject("PetsRepository")
    private petsRepository: IPetsRepository
  ) {}

  async execute(userId: string, appointmentId: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointmentId
    );

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    await this.checkIfUserOwnsPet(userId, appointment.pet_id);

    return appointment;
  }

  private async checkIfUserOwnsPet(
    userId: string,
    petId: string
  ): Promise<void> {
    const pet = await this.petsRepository.findByUserAndPetId(userId, petId);

    if (!pet) {
      throw new AppointmentNotFoundError();
    }
  }
}
