import { UsersRepository } from "../../repositories/UsersRepository";
import { hashPasswordAsync } from "../../utils/bcrypt";
import { generateJwt } from "../../utils/generateJwt";

export class CreateUserUseCase {
  static execute = async (body: {
    name: string;
    email: string;
    password: string;
  }) => {
    const user = UsersRepository.instance.create(body);

    user.password = await hashPasswordAsync(user.password);

    generateJwt(user);

    await UsersRepository.instance.save(user);

    return UsersRepository.instance.getUserCredentials(user);
  };
}
