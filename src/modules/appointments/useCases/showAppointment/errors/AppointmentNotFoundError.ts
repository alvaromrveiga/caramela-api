import { AppError } from "../../../../../shared/errors/AppError";

export class AppointmentNotFoundError extends AppError {
  constructor() {
    super("Appointment not found!", 404);
  }
}
