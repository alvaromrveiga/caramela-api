import { Request, Response } from "express";
import { container } from "tsyringe";

import { LogoutUserUseCase } from "./LogoutUserUseCase";

export class LogoutUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;

    const machineInfo =
      `${req.ip} ${req.headers["user-agent"]} ${req.headers["accept-language"]}`.replace(
        / undefined/g,
        ""
      );

    const logoutUserUseCase = container.resolve(LogoutUserUseCase);

    await logoutUserUseCase.execute(userId, machineInfo);

    return res.json();
  }
}
