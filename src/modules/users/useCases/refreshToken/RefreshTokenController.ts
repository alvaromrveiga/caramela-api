import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.body.refreshToken || req.headers["x-access-token"];

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const token = await refreshTokenUseCase.execute(refreshToken);

    return res.json({ token });
  }
}
