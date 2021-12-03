import sgMail from "@sendgrid/mail";

import { parseHandlebarsFile } from "../../../../utils/parseHandlebarsFile";
import { IMailProvider } from "../IMailProvider";

export class SendgridMailProvider implements IMailProvider {
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

    let from = "";

    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_EMAIL) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      from = process.env.SENDGRID_EMAIL;
    }

    sgMail
      .send({
        to: content.to,
        from,
        subject: content.subject,
        text: content.text,
        html: templateHTML,
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
