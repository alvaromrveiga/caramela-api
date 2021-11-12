import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidConsultationMotiveError extends AppError {
  constructor() {
    super("Please fill the consultation motive!", 400);
  }
}
