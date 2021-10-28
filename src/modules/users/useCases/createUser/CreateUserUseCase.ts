import { inject, injectable } from "tsyringe";
import validator from "validator";

import { minimumPasswordLength } from "../../../../config/password";
import { hashPasswordAsync } from "../../../../utils/bcrypt";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IPrivateUserCredentialsDTO } from "../../dtos/IPrivateUserCredentialsDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { EmailInUseError } from "./errors/EmailInUseError";
import { InvalidEmailError } from "./errors/InvalidEmailError";
import { InvalidPasswordCreationError } from "./errors/InvalidPasswordCreationError";

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
    };
  }

  private validateCredentials = async (data: ICreateUserDTO) => {
    await this.validateEmail(data.email);
    await this.validatePassword(data.password);
  };

  private validateEmail = async (email: string) => {
    if (!email) {
      throw new InvalidEmailError();
    }

    if (validator.isEmail(email)) {
      if (await this.usersRepository.findByEmail(email)) {
        throw new EmailInUseError();
      }
      return true;
    }

    throw new InvalidEmailError();
  };

  private validatePassword = async (password: string) => {
    if (!password || password.length < minimumPasswordLength) {
      throw new InvalidPasswordCreationError();
    }
  };
}
