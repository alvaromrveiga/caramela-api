import { UsersRepository } from "../../repositories/UsersRepository";
import { comparePasswordAsync } from "../../utils/bcrypt";
import { ErrorWithStatus } from "../../utils/ErrorWithStatus";

export class DeleteUserUseCase {
  constructor(private id: string, private password: string) {}

  execute = async () => {
    await this.verifyPassword();

    const user = await UsersRepository.instance.delete({ id: this.id });

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }

    return true;
  };

  verifyPassword = async () => {
    const user = await UsersRepository.instance.findOne({ id: this.id });

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }

    if (!this.password) {
      throw new ErrorWithStatus(400, "Invalid password");
    }

    const result = await comparePasswordAsync(this.password, user.password);

    if (!result) {
      throw new ErrorWithStatus(400, "Invalid password");
    }

    return true;
  };
}
