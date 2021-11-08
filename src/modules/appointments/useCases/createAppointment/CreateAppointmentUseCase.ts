import { inject, injectable } from "tsyringe";

import { PetNotFoundError } from "../../../../shared/errors/PetNotFoundError";
import { IPetsRepository } from "../../../pets/repositories/IPetsRepository";
import { ICreateAppointmentDTO } from "../../dtos/ICreateAppointmentDTO";
import { Appointment } from "../../infra/typeorm/entities/Appointment";
import { IAppointmentsRepository } from "../../repositories/IAppointmentsRepository";
import { InvalidAppointmentMotiveError } from "./errors/InvalidAppointmentMotiveError";
import { InvalidVeterinaryError } from "./errors/InvalidVeterinaryError";

@injectable()
export class CreateAppointmentUseCase {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,

    @inject("PetsRepository")
    private petsRepository: IPetsRepository
  ) {}

  async execute(data: ICreateAppointmentDTO): Promise<Appointment> {
    await this.validateCredentials(data);

    const appointment = await this.appointmentsRepository.createAndSave(data);

    return appointment;
  }

  private async validateCredentials(
    data: ICreateAppointmentDTO
  ): Promise<void> {
    await this.validatePet(data.pet_id);

    this.validateMotive(data.motive);

    this.validateVeterinary(data.veterinary);
  }

  private async validatePet(petId: string): Promise<void> {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      throw new PetNotFoundError();
    }
  }

  private validateMotive(motive: string): void {
    if (!motive) {
      throw new InvalidAppointmentMotiveError();
    }
  }

  private validateVeterinary(veterinary: string): void {
    if (!veterinary) {
      throw new InvalidVeterinaryError();
    }
  }
}
