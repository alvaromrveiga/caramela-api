import { inject, injectable } from "tsyringe";

import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IResponse {
  name: string;
  created_at: Date;
}

@injectable()
export class ShowPublicUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<IResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ErrorWithStatus(404, "User not found");
    }

    return {
      name: user.name,
      created_at: user.created_at,
    };
  }
}
