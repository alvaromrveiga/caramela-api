import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowPrivateUserUseCase } from "./ShowPrivateUserUseCase";

export class ShowPrivateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;

    const showPrivateUserUseCase = container.resolve(ShowPrivateUserUseCase);

    const response = await showPrivateUserUseCase.execute(userId);

    return res.json(response);
  }
}
