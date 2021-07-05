import { UsersRepository } from "../../repositories/UsersRepository";
import { comparePasswordAsync } from "../../utils/bcrypt";
import { ErrorWithStatus } from "../../utils/ErrorWithStatus";

export class DeleteUserUseCase {
  constructor(private id: string, private password: string) {}

  execute = async () => {
    await this.verifyPassword();

    await UsersRepository.instance.delete({ id: this.id });

    return true;
  };

  verifyPassword = async () => {
    const user = await UsersRepository.instance.findOne({ id: this.id });

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }

    const result = await UsersRepository.instance.verifyPassword(
      this.password,
      user.password
    );

    if (!result) {
      throw new ErrorWithStatus(400, "Invalid password");
    }

    return true;
  };
}
