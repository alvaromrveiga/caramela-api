import { User } from "../../models/User";
import { UsersRepository } from "../../repositories/UsersRepository";
import { ErrorWithStatus } from "../../utils/ErrorWithStatus";
import { generateJwt } from "../../utils/generateJwt";

export class LoginUserUseCase {
  constructor(private email: string, private password: string) {}

  execute = async () => {
    const user = await UsersRepository.instance.findOne({ email: this.email });

    if (!user) {
      throw new ErrorWithStatus(400, "Invalid email or password!");
    }

    await this.verifyPassword(user);

    generateJwt(user);

    await UsersRepository.instance.save(user);

    return UsersRepository.instance.getUserCredentials(user);
  };

  private verifyPassword = async (user: User) => {
    const result = await UsersRepository.instance.verifyPassword(
      this.password,
      user.password
    );

    if (!result) {
      throw new ErrorWithStatus(400, "Invalid email or password!");
    }
  };
}
