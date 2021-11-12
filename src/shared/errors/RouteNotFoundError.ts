import { AppError } from "./AppError";

export class RouteNotFoundError extends AppError {
  constructor() {
    super("Route not found!", 404);
  }
}
