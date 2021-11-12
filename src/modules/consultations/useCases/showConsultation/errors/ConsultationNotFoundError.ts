import { AppError } from "../../../../../shared/errors/AppError";

export class ConsultationNotFoundError extends AppError {
  constructor() {
    super("Consultation not found!", 404);
  }
}
