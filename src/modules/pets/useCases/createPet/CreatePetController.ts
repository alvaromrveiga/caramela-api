import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreatePetUseCase } from "./CreatePetUseCase";

export class CreatePetController {
  async handle(req: Request, res: Response): Promise<Response> {
    const user_id = res.locals.user.id;
    const { name, gender, species, weight_kg, birthday } = req.body;

    const createPetUseCase = container.resolve(CreatePetUseCase);

    const pet = await createPetUseCase.execute({
      user_id,
      name,
      species,
      gender,
      weight_kg,
      birthday,
    });

    return res.status(201).json(pet);
  }
}
