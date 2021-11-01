export interface IMailProvider {
  sendMail(content: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<void>;
}
