import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidTokenError extends AppError {
  constructor() {
    super("Invalid token!", 500);
  }
}
