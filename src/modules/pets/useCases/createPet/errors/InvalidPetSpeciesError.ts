import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidPetSpeciesError extends AppError {
  constructor() {
    super("Please choose your pet species!");
  }
}
