export interface IMailProvider {
  sendMail(content: {
    to: string;
    subject: string;
    text: string;
    htmlTemplatePath: string;
    variables?: { [key: string]: string | number | boolean };
  }): Promise<void>;
}
