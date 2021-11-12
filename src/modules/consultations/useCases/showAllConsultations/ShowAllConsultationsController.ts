import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowAllConsultationsUseCase } from "./ShowAllConsultationsUseCase";

export class ShowAllConsultationsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const { id: petId } = req.params;

    const showAllConsultationsUseCase = container.resolve(
      ShowAllConsultationsUseCase
    );

    const consultations = await showAllConsultationsUseCase.execute(
      userId,
      petId
    );

    return res.json(consultations);
  }
}
