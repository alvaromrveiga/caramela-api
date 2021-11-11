import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowAppointmentUseCase } from "./ShowAppointmentUseCase";

export class ShowAppointmentController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const { id: appointmentId } = req.params;

    const showAppointmentUseCase = container.resolve(ShowAppointmentUseCase);

    const appointment = await showAppointmentUseCase.execute(
      userId,
      appointmentId
    );

    return res.json(appointment);
  }
}
