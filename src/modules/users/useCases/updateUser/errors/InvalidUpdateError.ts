import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidUpdateError extends AppError {
  constructor() {
    super("Invalid update!");
  }
}
