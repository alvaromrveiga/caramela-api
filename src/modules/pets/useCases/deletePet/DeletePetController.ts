import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeletePetUseCase } from "./DeletePetUseCase";

export class DeletePetController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userId = res.locals.user.id;
    const petName = req.params.pet;

    const deletePetUseCase = container.resolve(DeletePetUseCase);

    await deletePetUseCase.execute(userId, petName);

    return res.json();
  }
}
