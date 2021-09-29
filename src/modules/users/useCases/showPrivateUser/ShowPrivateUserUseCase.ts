import { inject, injectable } from "tsyringe";

import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IResponse {
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  tokens: string[];
}

@injectable()
export class ShowPrivateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(user: User): Promise<IResponse> {
    return {
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      tokens: user.tokens,
    };
  }
}
