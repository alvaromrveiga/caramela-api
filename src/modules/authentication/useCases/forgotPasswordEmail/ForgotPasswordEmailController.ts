import { Request, Response } from "express";
import { container } from "tsyringe";

import { ForgotPasswordEmailUseCase } from "./ForgotPasswordEmailUseCase";

export class ForgotPasswordEmailController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    const hostname = req.headers.host;

    const forgotPasswordEmailUseCase = container.resolve(
      ForgotPasswordEmailUseCase
    );

    await forgotPasswordEmailUseCase.execute(email, hostname);

    return res.json();
  }
}
