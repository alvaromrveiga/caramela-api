import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeletePetUseCase } from "./DeletePetUseCase";

export class DeletePetController {
  async handle(req: Request, res: Response): Promise<Response> {
    const userId = res.locals.user.id;
    const petId = req.params.id;

    const deletePetUseCase = container.resolve(DeletePetUseCase);

    await deletePetUseCase.execute(userId, petId);

    return res.json();
  }
}
