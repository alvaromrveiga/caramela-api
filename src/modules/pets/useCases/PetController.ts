import { Request, Response } from "express";

import { CreatePetUseCase } from "./CreatePetUseCase";

export class PetController {
  create = async (req: Request, res: Response) => {
    const pet = await new CreatePetUseCase(
      res.locals.user.id,
      req.body
    ).execute();

    res.status(201).json(pet);
  };
}
