import { UsersRepository } from "../../repositories/UsersRepository";
import { hashPasswordAsync } from "../../utils/bcrypt";
import { generateJwt } from "../../utils/generateJwt";
import validator from "validator";
import { ErrorWithStatus } from "../../utils/ErrorWithStatus";

export interface IUserCreateCredentials {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(private body: IUserCreateCredentials) {}

  execute = async () => {
    await this.validateCredentials();

    const user = UsersRepository.instance.create(this.body);

    user.password = await hashPasswordAsync(user.password);

    generateJwt(user);

    await UsersRepository.instance.save(user);

    return UsersRepository.instance.getUserCredentials(user);
  };

  private validateCredentials = async () => {
    await this.validateEmail();
    await this.validatePassword();
  };

  private validateEmail = async () => {
    if (!this.body.email) {
      throw new ErrorWithStatus(400, "Invalid email");
    }

    if (validator.isEmail(this.body.email)) {
      if (await UsersRepository.instance.findOne({ email: this.body.email })) {
        throw new ErrorWithStatus(400, "Email already in use!");
      }
      return true;
    }

    throw new ErrorWithStatus(400, "Invalid email");
  };

  private validatePassword = async () => {
    if (!this.body.password) {
      throw new ErrorWithStatus(400, "Invalid password");
    }

    const minLength = 8;

    if (this.body.password.length < minLength) {
      throw new ErrorWithStatus(
        400,
        `Password shorter than ${minLength} characters`
      );
    }
    return true;
  };
}
