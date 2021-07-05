import { UsersRepository } from "../../repositories/UsersRepository";
import { hashPasswordAsync } from "../../utils/bcrypt";
import { generateJwt } from "../../utils/generateJwt";
import validator from "validator";
import { ErrorWithStatus } from "../../utils/ErrorWithStatus";

export class CreateUserUseCase {
  constructor(
    private body: { name: string; email: string; password: string }
  ) {}

  execute = async () => {
    await this.validateEmail(this.body.email);

    const user = UsersRepository.instance.create(this.body);

    user.password = await hashPasswordAsync(user.password);

    generateJwt(user);

    await UsersRepository.instance.save(user);

    return UsersRepository.instance.getUserCredentials(user);
  };

  validateEmail = async (email: string) => {
    if (validator.isEmail(email)) {
      if (await UsersRepository.instance.findOne({ email })) {
        throw new ErrorWithStatus(400, "Email already in use!");
      }
      return true;
    }

    throw new ErrorWithStatus(400, "Invalid email");
  };
}
