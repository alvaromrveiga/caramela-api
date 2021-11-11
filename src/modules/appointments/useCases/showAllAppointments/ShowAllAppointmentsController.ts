import { Request, Response } from "express";
import { container } from "tsyringe";

import { ShowAllAppointmentsUseCase } from "./ShowAllAppointmentsUseCase";

export class ShowAllAppointmentsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals;
    const { id: petId } = req.params;

    const showAllAppointmentsUseCase = container.resolve(
      ShowAllAppointmentsUseCase
    );

    const appointments = await showAllAppointmentsUseCase.execute(
      userId,
      petId
    );

    return res.json(appointments);
  }
}
