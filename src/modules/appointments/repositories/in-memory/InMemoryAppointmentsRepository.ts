import { ICreateAppointmentDTO } from "../../dtos/ICreateAppointmentDTO";
import { Appointment } from "../../infra/typeorm/entities/Appointment";
import { IAppointmentsRepository } from "../IAppointmentsRepository";

export class InMemoryAppointmentsRepository implements IAppointmentsRepository {
  private appointmentsRepository: Appointment[];

  constructor() {
    this.appointmentsRepository = [];
  }
  async createAndSave(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment(data);

    Object.assign(appointment, { created_at: new Date() });

    return appointment;
  }
}
