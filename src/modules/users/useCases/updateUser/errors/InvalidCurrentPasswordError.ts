import { AppError } from "../../../../../shared/errors/AppError";

export class InvalidCurrentPasswordError extends AppError {
  constructor() {
    super("Invalid current password!");
  }
}
