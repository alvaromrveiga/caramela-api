import { inject, injectable } from "tsyringe";

import { getValidatedUser } from "../../../../utils/getValidatedUser";
import { IPrivateUserCredentialsDTO } from "../../dtos/IPrivateUserCredentialsDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class ShowPrivateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(userId: string): Promise<IPrivateUserCredentialsDTO> {
    const user = await getValidatedUser(userId, this.usersRepository);

    return {
      id: user.id,
      avatar: user.avatar,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
