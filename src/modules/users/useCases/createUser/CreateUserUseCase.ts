import { inject, injectable } from "tsyringe";
import validator from "validator";

import { hashPasswordAsync } from "../../../../utils/bcrypt";
import { ErrorWithStatus } from "../../../../utils/ErrorWithStatus";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IPrivateUserCredentialsDTO } from "../../dtos/IPrivateUserCredentialsDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute(data: ICreateUserDTO): Promise<IPrivateUserCredentialsDTO> {
    await this.validateCredentials(data);

    const passwordHash = await hashPasswordAsync(data.password);

    const user = await this.usersRepository.createAndSave({
      ...data,
      email: data.email.toLowerCase(),
      password: passwordHash,
    });

    return {
      id: user.id,
      avatar: user.avatar,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      tokens: user.tokens,
    };
  }

  private validateCredentials = async (data: ICreateUserDTO) => {
    await this.validateEmail(data.email);
    await this.validatePassword(data.password);
  };

  private validateEmail = async (email: string) => {
    if (!email) {
      throw new ErrorWithStatus(400, "Invalid email");
    }

    if (validator.isEmail(email)) {
      if (await this.usersRepository.findByEmail(email)) {
        throw new ErrorWithStatus(400, "Email already in use!");
      }
      return true;
    }

    throw new ErrorWithStatus(400, "Invalid email");
  };

  private validatePassword = async (password: string) => {
    if (!password) {
      throw new ErrorWithStatus(400, "Invalid password");
    }

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
