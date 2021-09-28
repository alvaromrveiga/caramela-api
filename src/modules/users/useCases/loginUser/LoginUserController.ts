import { Request, Response } from "express";
import { container } from "tsyringe";

import { LoginUserUseCase } from "./LoginUserUseCase";

export class LoginUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const loginUserUseCase = container.resolve(LoginUserUseCase);

    const user = await loginUserUseCase.execute(email, password);

    return res.json(user);
  }
}
