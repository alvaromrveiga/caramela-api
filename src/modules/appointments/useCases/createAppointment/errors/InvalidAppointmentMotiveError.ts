import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidAppointmentMotiveError extends AppError {
  constructor() {
    super("Please fill the appointment motive!", 400);
  }
}
