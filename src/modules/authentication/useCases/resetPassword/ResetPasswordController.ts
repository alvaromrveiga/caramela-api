import { Request, Response } from "express";
import { container } from "tsyringe";

import { ResetPasswordUseCase } from "./ResetPasswordUseCase";

export class ResetPasswordController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    await resetPasswordUseCase.execute(id, token, newPassword);

    return res.json();
  }
}
