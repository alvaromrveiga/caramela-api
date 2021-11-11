import { getRepository, Repository } from "typeorm";

import { ICreateAppointmentDTO } from "../../../dtos/ICreateAppointmentDTO";
import { IAppointmentsRepository } from "../../../repositories/IAppointmentsRepository";
import { Appointment } from "../entities/Appointment";

export class AppointmentsRepository implements IAppointmentsRepository {
  private repository: Repository<Appointment>;

  constructor() {
    this.repository = getRepository(Appointment);
  }

  async createAndSave(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.repository.create(data);

    await this.repository.save(appointment);

    return appointment;
  }

  async findById(appointmentId: string): Promise<Appointment | undefined> {
    return this.repository.findOne({ id: appointmentId });
  }

  async findAllByPetId(petId: string): Promise<Appointment[]> {
    return this.repository.find({ pet_id: petId });
  }
}
