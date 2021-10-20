import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteUserUseCase } from "./DeleteUserUseCase";

export class DeleteUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const { password } = req.body;

    const deleteUserUseCase = container.resolve(DeleteUserUseCase);

    await deleteUserUseCase.execute(userId, password);

    return res.status(200).json();
  }
}
