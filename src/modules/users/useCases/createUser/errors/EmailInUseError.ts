import { AppError } from "../../../../../shared/errors/AppError";

export class EmailInUseError extends AppError {
  constructor() {
    super("Email already in use!");
  }
}
