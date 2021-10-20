import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdatePetAvatarUseCase } from "./UpdatePetAvatarUseCase";

export class UpdatePetAvatarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const petId = req.params.id;
    const avatarFile = req.file?.filename;

    const updatePetAvatarUseCase = container.resolve(UpdatePetAvatarUseCase);

    const pet = await updatePetAvatarUseCase.execute(userId, petId, avatarFile);

    return res.json(pet);
  }
}
