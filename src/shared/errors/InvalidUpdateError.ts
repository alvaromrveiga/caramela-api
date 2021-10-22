import { AppError } from "./AppError";

export class InvalidUpdateError extends AppError {
  constructor() {
    super("Invalid update!");
  }
}
