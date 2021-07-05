import { UsersRepository } from "../../repositories/UsersRepository";
import { ErrorWithStatus } from "../../utils/ErrorWithStatus";

export class DeleteUserUseCase {
  static execute = async (id: string) => {
    const user = await UsersRepository.instance.delete({ id });

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }

    return true;
  };
}
