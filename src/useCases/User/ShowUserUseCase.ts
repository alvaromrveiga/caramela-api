import { UsersRepository } from "../../repositories/UsersRepository";
import { ErrorWithStatus } from "../../utils/ErrorWithStatus";

export class ShowUserUseCase {
  private static execute = async (id: string) => {
    const user = await UsersRepository.instance.findOne(id);

    if (!user) {
      throw new ErrorWithStatus(404, "User not found");
    }

    return user;
  };

  static publicUser = async (id: string) => {
    const user = await ShowUserUseCase.execute(id);

    return UsersRepository.instance.getPublicUserCredentials(user);
  };

  static self = async (id: string) => {
    const user = await ShowUserUseCase.execute(id);

    return UsersRepository.instance.getUserCredentials(user);
  };
}
