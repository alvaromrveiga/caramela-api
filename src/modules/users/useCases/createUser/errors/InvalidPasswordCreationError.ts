import { minimumPasswordLength } from "../../../../../config/password";
import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidPasswordCreationError extends AppError {
  constructor() {
    super(
      `Invalid password! Password should be longer than ${minimumPasswordLength} characters!`
    );
  }
}
