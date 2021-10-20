import { Request, Response } from "express";
import { container } from "tsyringe";

import { LogoutUserUseCase } from "./LogoutUserUseCase";

export class LogoutUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId, token } = res.locals;

    const logoutUserUseCase = container.resolve(LogoutUserUseCase);

    await logoutUserUseCase.execute(userId, token);

    return res.json();
  }
}
