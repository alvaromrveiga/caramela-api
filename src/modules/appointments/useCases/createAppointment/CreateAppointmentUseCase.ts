import { inject, injectable } from "tsyringe";

import { getValidatedPet } from "../../../../shared/utils/getValidatedPet";
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

  async execute(
    userId: string,
    data: ICreateAppointmentDTO
  ): Promise<Appointment> {
    await this.validateCredentials(userId, data);

    const appointment = await this.appointmentsRepository.createAndSave(data);

    await this.updatePetWeight(userId, data);

    return appointment;
  }

  private async validateCredentials(
    userId: string,
    data: ICreateAppointmentDTO
  ): Promise<void> {
    await getValidatedPet(userId, data.pet_id, this.petsRepository);

    this.validateMotive(data.motive);

    this.validateVeterinary(data.veterinary);
  }

  private async updatePetWeight(
    userId: string,
    data: ICreateAppointmentDTO
  ): Promise<void> {
    const pet = await getValidatedPet(userId, data.pet_id, this.petsRepository);

    if (data.weight_kg) {
      pet.weight_kg = data.weight_kg;
      await this.petsRepository.createAndSave(pet);
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
