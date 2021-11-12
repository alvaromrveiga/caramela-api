import { AppError } from "../../../../../shared/errors/AppError";

export class LoginError extends AppError {
  constructor() {
    super("Invalid email or password!");
  }
}
