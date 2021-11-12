import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowTokensUseCase } from "./ShowTokensUseCase";

export class ShowTokensController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;

    const showTokensUseCase = container.resolve(ShowTokensUseCase);

    const userTokens = await showTokensUseCase.execute(userId);

    return res.json(userTokens);
  }
}
