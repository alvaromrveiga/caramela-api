import { AppError } from "../../../../../shared/errors/AppError";

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found!", 404);
  }
}
