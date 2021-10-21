import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidEmailError extends AppError {
  constructor() {
    super("Invalid email");
  }
}
