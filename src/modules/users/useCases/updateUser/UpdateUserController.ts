import { Request, Response } from "express";
import { container } from "tsyringe";

import { IAllowedUpdatesDTO } from "../../dtos/IAllowedUpdatesDTO";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const updates: IAllowedUpdatesDTO = req.body;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    const updatedUser = await updateUserUseCase.execute(userId, updates);

    return res.status(200).json(updatedUser);
  }
}
