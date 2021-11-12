import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidVeterinaryError extends AppError {
  constructor() {
    super("Invalid veterinary!", 400);
  }
}
