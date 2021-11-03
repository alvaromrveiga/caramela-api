import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import {
  resetPasswordTokenExpiresInHours,
  resetPasswordTokenSecret,
} from "../../../../config/auth";
import { IMailProvider } from "../../../../shared/container/providers/MailProvider/IMailProvider";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { UserNotFoundError } from "../showPublicUser/errors/UserNotFoundError";
import { NoHostnameError } from "./errors/NoHostnameError";

@injectable()
export class ForgotPasswordEmailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string, hostname?: string): Promise<void> {
    const user = await this.getValidatedUser(email);

    const token = this.getGeneratedToken(user);

    await this.sendEmail(user, token, hostname);
  }

  async getValidatedUser(email: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  getGeneratedToken(user: User): string {
    const token = sign({ id: user.id }, resetPasswordTokenSecret, {
      subject: user.email,
      issuer: user.updated_at.toISOString(),
      expiresIn: `${resetPasswordTokenExpiresInHours}h`,
    });

    return token;
  }

  async sendEmail(user: User, token: string, hostname?: string): Promise<void> {
    if (!hostname) {
      throw new NoHostnameError();
    }

    const resetPasswordLink = `${hostname}/password/reset?token=${token}`;

    await this.mailProvider.sendMail({
      to: user.email,
      subject: "Reset password",
      text: `Hello ${user.name}, here is the link to reset your password: ${resetPasswordLink}`,
      html: `<p>Hello ${user.name}, here is the link to reset your password: ${resetPasswordLink}</p>`,
    });
  }
}
