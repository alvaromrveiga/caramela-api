import { AppError } from "./AppError";

export class AuthenticationError extends AppError {
  constructor() {
    super("You are not authenticated, please login!", 401);
  }
}
