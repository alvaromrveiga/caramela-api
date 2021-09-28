import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteUserUseCase } from "./DeleteUserUseCase";

export class DeleteUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = res.locals.user;
    const { password } = req.body;

    const deleteUserUseCase = container.resolve(DeleteUserUseCase);

    await deleteUserUseCase.execute(id, password);

    return res.status(200).json();
  }
}
