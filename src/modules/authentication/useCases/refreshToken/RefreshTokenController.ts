import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const refreshToken =
      req.headers["x-access-token"] || req.query.token || req.body.refreshToken;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const token = await refreshTokenUseCase.execute(refreshToken);

    return res.json({ token });
  }
}
