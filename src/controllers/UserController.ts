import { Request, Response } from "express";
import { UsersRepository } from "./repositories/UsersRepository";

class UserController {
  async create(req: Request, res: Response) {
    const user = await UsersRepository.instance.createAndSave(req.body);

    res.status(201).json(user);
  }

  async show(req: Request, res: Response) {
    const user = await UsersRepository.instance.showPublic(req.params.id);

    res.status(200).json(user);
  }

  async showSelf(req: Request, res: Response) {
    const user = await UsersRepository.instance.showSelf(req.body.id);

    res.status(200).json(user);
  }

  async deleteUser(req: Request, res: Response) {
    await UsersRepository.instance.deleteUser(req.body.id);

    res.status(200).json({ message: "User removed successfully!" });
  }
}

export { UserController };
