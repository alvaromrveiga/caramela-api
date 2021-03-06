import { sign } from "jsonwebtoken";
import { resolve } from "path";
import { inject, injectable } from "tsyringe";

import { resetPasswordTokenExpiresInHours } from "../../../../config/auth";
import { IMailProvider } from "../../../../shared/container/providers/MailProvider/IMailProvider";
import { getResetPasswordTokenSecret } from "../../../../shared/utils/getResetPasswordTokenSecret";
import { User } from "../../../users/infra/typeorm/entities/User";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
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
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      const token = this.getGeneratedToken(user);

      await this.sendEmail(user, token, hostname);
    }
  }

  private getGeneratedToken(user: User): string {
    const resetPasswordTokenSecret = this.makeTokenUsableOnce(user);

    const token = sign({}, resetPasswordTokenSecret, {
      subject: user.email,
      expiresIn: `${resetPasswordTokenExpiresInHours}h`,
    });

    return token;
  }

  private makeTokenUsableOnce(user: User): string {
    // When the password change the secret will be invalid, making the token usable only once
    return getResetPasswordTokenSecret(user);
  }

  private async sendEmail(
    user: User,
    token: string,
    hostname?: string
  ): Promise<void> {
    if (!hostname) {
      throw new NoHostnameError();
    }

    const resetPasswordLink = `${hostname}/resetpassword/${user.id}/${token}`;

    const htmlTemplatePath = resolve(
      __dirname,
      "views",
      "forgotPasswordEmail.hbs"
    );

    await this.mailProvider.sendMail({
      to: user.email,
      subject: "Reset password",
      text: `Hello ${user.name}, here is the link to reset your password: ${resetPasswordLink}`,
      htmlTemplatePath,
      variables: {
        name: user.name,
        link: resetPasswordLink,
      },
    });
  }
}
