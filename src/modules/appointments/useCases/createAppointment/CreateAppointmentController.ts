import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateAppointmentUseCase } from "./CreateAppointmentUseCase";

export class CreateAppointmentController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { pet_id, motive, veterinary, weight_kg, vaccines, comments } =
      req.body;

    const createAppointmentUseCase = container.resolve(
      CreateAppointmentUseCase
    );

    const appointment = await createAppointmentUseCase.execute({
      pet_id,
      motive,
      veterinary,
      weight_kg,
      vaccines,
      comments,
    });

    return res.status(201).json(appointment);
  }
}
