import nodemailer, { Transporter } from "nodemailer";

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
    html: string;
  }): Promise<void> {
    const transporter = await this.generateTestAccount();

    const message = await transporter.sendMail({
      to: content.to,
      from: "Caramela <noreply@caramela.com>",
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    console.log("Email preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}
