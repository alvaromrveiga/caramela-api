import { Request, Response } from "express";
import { container } from "tsyringe";

import { LogoutAllUserUseCase } from "./LogoutAllUserUseCase";

export class LogoutAllUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { user } = res.locals;

    const logoutUserUseCase = container.resolve(LogoutAllUserUseCase);

    await logoutUserUseCase.execute(user);

    return res.json();
  }
}
