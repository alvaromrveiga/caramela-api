import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowConsultationUseCase } from "./ShowConsultationUseCase";

export class ShowConsultationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const { id: consultationId } = req.params;

    const showConsultationUseCase = container.resolve(ShowConsultationUseCase);

    const consultation = await showConsultationUseCase.execute(
      userId,
      consultationId
    );

    return res.json(consultation);
  }
}
