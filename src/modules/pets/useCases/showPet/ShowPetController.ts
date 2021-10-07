import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowPetUseCase } from "./ShowPetUseCase";

export class ShowPetController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userId = res.locals.user.id;
    const petName = req.params.pet;

    const showPetUseCase = container.resolve(ShowPetUseCase);

    const pet = await showPetUseCase.execute(userId, petName);

    return res.json(pet);
  }
}
