import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowAllPetsUseCase } from "./ShowAllPetsUseCase";

export class ShowAllPetsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = res.locals.user;

    const showAllPetsUseCase = container.resolve(ShowAllPetsUseCase);

    const pets = await showAllPetsUseCase.execute(id);

    return res.json(pets);
  }
}
