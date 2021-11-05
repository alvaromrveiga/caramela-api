import { hash } from "bcrypt";
import { verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { saltRounds } from "../../../../config/bcrypt";
import { minimumPasswordLength } from "../../../../config/password";
import { getResetPasswordTokenSecret } from "../../../../shared/utils/getResetPasswordTokenSecret";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { InvalidPasswordCreationError } from "../createUser/errors/InvalidPasswordCreationError";
import { UserNotFoundError } from "../showPublicUser/errors/UserNotFoundError";
import { InvalidTokenError } from "./errors/InvalidTokenError";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository
  ) {}

  async execute(id: string, token: string, newPassword: string): Promise<void> {
    const user = await this.getValidatedUser(id);

    this.verifyToken(user, token);

    if (!newPassword || newPassword.length < minimumPasswordLength) {
      throw new InvalidPasswordCreationError();
    }

    user.password = await hash(newPassword, saltRounds);

    await this.usersRepository.createAndSave(user);

    await this.usersTokensRepository.deleteAllByUserId(user.id);
  }

  private async getValidatedUser(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  private verifyToken(user: User, token: string) {
    const resetPasswordTokenSecret = getResetPasswordTokenSecret(user);
    const { sub: email } = verify(token, resetPasswordTokenSecret) as {
      sub: string;
    };

    this.verifyIfTokenEmailWasModified(user.email, email);
  }

  private verifyIfTokenEmailWasModified(userEmail: string, tokenEmail: string) {
    if (userEmail !== tokenEmail) {
      throw new InvalidTokenError();
    }
  }
}
