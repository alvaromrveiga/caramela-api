import sgMail from "@sendgrid/mail";

import { IMailProvider } from "../IMailProvider";

export class SendgridMailProvider implements IMailProvider {
  async sendMail(content: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void> {
    let from = "";

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_EMAIL) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      from = process.env.SENDGRID_EMAIL;
    }

    sgMail.send({ ...content, from }).catch((error) => {
      console.error(error);
    });
  }
}
