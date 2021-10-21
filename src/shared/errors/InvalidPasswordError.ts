import { AppError } from "./AppError";

export class InvalidPasswordError extends AppError {
  constructor() {
    super("Invalid password!");
  }
}
