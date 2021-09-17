import { ErrorWithStatus } from "../../../utils/ErrorWithStatus";
import { User } from "../infra/typeorm/entities/User";
import { UsersRepository } from "../infra/typeorm/repositories/UsersRepository";

export class ShowUserUseCase {
  constructor(private id?: string) {}

  private execute = async () => {
    const user = await UsersRepository.instance.findOne(this.id);

    if (!user) {
      throw new ErrorWithStatus(404, "User not found");
    }

    return user;
  };

  publicUser = async () => {
    const user = await this.execute();

    return UsersRepository.instance.getPublicUserCredentials(user);
  };

  self = async (user: User) => {
    return UsersRepository.instance.getUserCredentials(user);
  };
}
