import { Request, Response } from "express";
import { UsersRepository } from "./UsersRepository";

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { responseStatus, message } =
        await UsersRepository.getInstance().createAndSave(req.body);

      res.status(responseStatus).json(message);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { responseStatus, message } =
        await UsersRepository.getInstance().showPublic(req.params.id);

      res.status(responseStatus).json(message);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }
}

export { UserController };
