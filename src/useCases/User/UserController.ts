import { Request, Response } from "express";
import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

class UserController {
  create = async (req: Request, res: Response) => {
    const user = await CreateUserUseCase.execute(req.body);

    res.status(201).json(user);
  };

  show = async (req: Request, res: Response) => {
    const user = await UsersRepository.instance.showPublic(req.params.id);

    res.status(200).json(user);
  };

  showSelf = async (req: Request, res: Response) => {
    const user = await UsersRepository.instance.showSelf(req.body.id);

    res.status(200).json(user);
  };

  deleteUser = async (req: Request, res: Response) => {
    await UsersRepository.instance.deleteUser(req.body.id);

    res.status(200).json({ message: "User removed successfully!" });
  };
}

export { UserController };
