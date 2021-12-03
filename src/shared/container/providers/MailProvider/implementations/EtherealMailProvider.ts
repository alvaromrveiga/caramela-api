import nodemailer, { Transporter } from "nodemailer";

import { parseHandlebarsFile } from "../../../../utils/parseHandlebarsFile";
import { IMailProvider } from "../IMailProvider";

export class EtherealMailProvider implements IMailProvider {
  // constructor() {}

  async generateTestAccount(): Promise<Transporter> {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    return transporter;
  }

  async sendMail(content: {
    to: string;
    subject: string;
    text: string;
    htmlTemplatePath: string;
    variables?: { [key: string]: string | number | boolean };
  }): Promise<void> {
    const templateHTML = parseHandlebarsFile(
      content.htmlTemplatePath,
      content.variables
    );

    const transporter = await this.generateTestAccount();

    const message = await transporter.sendMail({
      to: content.to,
      from: "Caramela <noreply@caramela.com>",
      subject: content.subject,
      text: content.text,
      html: templateHTML,
    });

    console.log("Email preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}
