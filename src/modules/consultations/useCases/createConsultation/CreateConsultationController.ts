import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateConsultationUseCase } from "./CreateConsultationUseCase";

export class CreateConsultationController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const { pet_id, motive, veterinary, weight_kg, vaccines, comments } =
      req.body;

    const createConsultationUseCase = container.resolve(
      CreateConsultationUseCase
    );

    const consultation = await createConsultationUseCase.execute(userId, {
      pet_id,
      motive,
      veterinary,
      weight_kg,
      vaccines,
      comments,
    });

    return res.status(201).json(consultation);
  }
}
