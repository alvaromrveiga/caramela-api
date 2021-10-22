import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidPetNameError extends AppError {
  constructor() {
    super("Invalid pet name");
  }
}
