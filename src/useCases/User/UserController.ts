import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { LoginUserUseCase } from "./LoginUserUseCase";
import { ShowUserUseCase } from "./ShowUserUseCase";

class UserController {
  create = async (req: Request, res: Response) => {
    const user = await new CreateUserUseCase(req.body).execute();

    res.status(201).json(user);
  };

  login = async (req: Request, res: Response) => {
    const user = await new LoginUserUseCase(
      req.body.email,
      req.body.password
    ).execute();

    res.status(200).json(user);
  };

  show = async (req: Request, res: Response) => {
    const user = await new ShowUserUseCase(req.params.id).publicUser();

    res.status(200).json(user);
  };

  showSelf = async (req: Request, res: Response) => {
    const user = await new ShowUserUseCase(res.locals.user.id).self();

    res.status(200).json(user);
  };

  deleteUser = async (req: Request, res: Response) => {
    await new DeleteUserUseCase(
      res.locals.user.id,
      req.body.password
    ).execute();

    res.status(200).json({ message: "User removed successfully!" });
  };
}

export { UserController };
