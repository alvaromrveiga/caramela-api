import { inject, injectable } from "tsyringe";

import { IPrivateUserCredentialsDTO } from "../../dtos/IPrivateUserCredentialsDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class ShowPrivateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(user: User): Promise<IPrivateUserCredentialsDTO> {
    return {
      id: user.id,
      avatar: user.avatar,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      tokens: user.tokens,
    };
  }
}
