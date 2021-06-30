import { Request, Response } from "express";
import { UsersRepository } from "./repositories/UsersRepository";

class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await UsersRepository.instance.createAndSave(req.body);

      res.status(201).json(user);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }

  async show(req: Request, res: Response) {
    try {
      const result = await UsersRepository.instance.showPublic(req.params.id);

      res.status(result.status).json(result.message);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }

  async showSelf(req: Request, res: Response) {
    try {
      const result = await UsersRepository.instance.showSelf(req.body.id);

      res.status(result.status).json(result.message);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }
}

export { UserController };
