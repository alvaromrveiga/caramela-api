import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowAllPetsUseCase } from "./ShowAllPetsUseCase";

export class ShowAllPetsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;

    const showAllPetsUseCase = container.resolve(ShowAllPetsUseCase);

    const pets = await showAllPetsUseCase.execute(userId);

    return res.json(pets);
  }
}
