import { User } from "../../models/User";
import { UsersRepository } from "../../repositories/UsersRepository";

export class LogoutUserUseCase {
  constructor(private user: User, private loginToken: string) {}

  execute = async () => {
    this.user.tokens = this.user.tokens.filter((token) => {
      return this.loginToken !== token;
    });

    await UsersRepository.instance.save(this.user);

    return true;
  };

  logOutAll = async () => {
    this.user.tokens = [];

    await UsersRepository.instance.save(this.user);

    return true;
  };
}
