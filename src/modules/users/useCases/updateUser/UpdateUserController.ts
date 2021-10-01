import { Request, Response } from "express";
import { container } from "tsyringe";

import { IAllowedUpdatesDTO } from "../../dtos/IAllowedUpdatesDTO";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { user } = res.locals;
    const updates: IAllowedUpdatesDTO = req.body;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    await updateUserUseCase.execute(user, updates);

    return res.status(204).json();
  }
}
