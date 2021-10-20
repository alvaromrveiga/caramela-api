import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowPetUseCase } from "./ShowPetUseCase";

export class ShowPetController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const petId = req.params.id;

    const showPetUseCase = container.resolve(ShowPetUseCase);

    const pet = await showPetUseCase.execute(userId, petId);

    return res.json(pet);
  }
}
