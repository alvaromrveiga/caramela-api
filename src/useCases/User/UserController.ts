import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { LoginUserUseCase } from "./LoginUserUseCase";
import { LogoutUserUseCase } from "./LogoutUserUseCase";
import { ShowUserUseCase } from "./ShowUserUseCase";

class UserController {
  create = async (req: Request, res: Response) => {
    const user = await new CreateUserUseCase(req.body).execute();

    res.status(201).json(user);
  };

  logIn = async (req: Request, res: Response) => {
    const user = await new LoginUserUseCase(
      req.body.email,
      req.body.password
    ).execute();

    res.status(200).json(user);
  };

  logOut = async (req: Request, res: Response) => {
    await new LogoutUserUseCase(res.locals.user, res.locals.token).execute();

    res.status(200).json({ message: "Logged out" });
  };

  logOutAll = async (req: Request, res: Response) => {
    await new LogoutUserUseCase(res.locals.user, res.locals.token).logOutAll();

    res.status(200).json({ message: "Logged out of all sessions" });
  };

  show = async (req: Request, res: Response) => {
    const user = await new ShowUserUseCase(req.params.id).publicUser();

    res.status(200).json(user);
  };

  showSelf = async (req: Request, res: Response) => {
    const user = await new ShowUserUseCase().self(res.locals.user);

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
