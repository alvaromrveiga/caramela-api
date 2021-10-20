import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdatePetUseCase } from "./UpdatePetUseCase";

export class UpdatePetController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const petId = req.params.id;
    const updates = req.body;

    const updateUserUseCase = container.resolve(UpdatePetUseCase);

    const pet = await updateUserUseCase.execute(userId, petId, updates);

    return res.status(200).json(pet);
  }
}
