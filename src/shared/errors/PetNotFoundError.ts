import { AppError } from "./AppError";

export class PetNotFoundError extends AppError {
  constructor() {
    super("Pet not found!", 404);
  }
}
