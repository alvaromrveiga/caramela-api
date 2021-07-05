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
    await this.validateCredentials(this.body);

    const user = UsersRepository.instance.create(this.body);

    user.password = await hashPasswordAsync(user.password);

    generateJwt(user);

    await UsersRepository.instance.save(user);

    return UsersRepository.instance.getUserCredentials(user);
  };

  private validateCredentials = async (body: IUserCreateCredentials) => {
    await this.validateEmail(body.email);
    await this.validatePassword(body.password);
  };

  private validateEmail = async (email: string) => {
    if (validator.isEmail(email)) {
      if (await UsersRepository.instance.findOne({ email })) {
        throw new ErrorWithStatus(400, "Email already in use!");
      }
      return true;
    }

    throw new ErrorWithStatus(400, "Invalid email");
  };

  private validatePassword = async (password: string) => {
    const minLength = 8;

    if (password.length < minLength) {
      throw new ErrorWithStatus(
        400,
        `Password shorter than ${minLength} characters`
      );
    }
    return true;
  };
}
