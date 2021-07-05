import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { ShowUserUseCase } from "./ShowUserUseCase";

class UserController {
  create = async (req: Request, res: Response) => {
    const user = await new CreateUserUseCase(req.body).execute();

    res.status(201).json(user);
  };

  show = async (req: Request, res: Response) => {
    const user = await ShowUserUseCase.publicUser(req.params.id);

    res.status(200).json(user);
  };

  showSelf = async (req: Request, res: Response) => {
    const user = await ShowUserUseCase.self(req.body.id);

    res.status(200).json(user);
  };

  deleteUser = async (req: Request, res: Response) => {
    await new DeleteUserUseCase(req.body.id, req.body.password).execute();

    res.status(200).json({ message: "User removed successfully!" });
  };
}

export { UserController };
