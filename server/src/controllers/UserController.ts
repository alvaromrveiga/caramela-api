import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UserController {
  constructor() {
    console.log("Iniciei");
  }

  async create(req: Request, res: Response) {
    try {
      const usersRepository = getCustomRepository(UsersRepository);

      const { responseStatus, message } = await usersRepository.createAndSave(
        req.body
      );

      res.status(responseStatus).json(message);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }

  // async show(req: Request, res: Response) {
  //   try {
  //     const { responseStatus, message } = await this.usersRepository.show(
  //       req.body
  //     );
  //     res.status(responseStatus).json(message);
  //   } catch (e) {
  //     console.error(e);
  //     res.status(500).send();
  //   }
  // }
}

export { UserController };
