import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";

export class UpdateUserAvatarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const avatarFile = req.file?.filename;

    const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);

    const avatar = await updateUserAvatarUseCase.execute(userId, avatarFile);

    return res.json(avatar);
  }
}
