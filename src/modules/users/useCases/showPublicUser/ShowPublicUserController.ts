import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowPublicUserUseCase } from "./ShowPublicUserUseCase";

export class ShowPublicUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const showPublicUserUseCase = container.resolve(ShowPublicUserUseCase);

    const response = await showPublicUserUseCase.execute(id);

    return res.json(response);
  }
}
