import { ICreateAppointmentDTO } from "../dtos/ICreateAppointmentDTO";
import { Appointment } from "../infra/typeorm/entities/Appointment";

export interface IAppointmentsRepository {
  createAndSave(data: ICreateAppointmentDTO): Promise<Appointment>;

  findById(appointmentId: string): Promise<Appointment | undefined>;
}
