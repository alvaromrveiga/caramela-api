import { container, InjectionToken } from "tsyringe";

import { MAIL_PROVIDER } from "../../../../config/providers";
import { IMailProvider } from "./IMailProvider";
import { EtherealMailProvider } from "./implementations/EtherealMailProvider";
import { SendgridMailProvider } from "./implementations/SendgridMailProvider";

interface IMailProviderMap {
  [key: string]: InjectionToken<IMailProvider>;
}

const mailProvider: IMailProviderMap = {
  ethereal: EtherealMailProvider,
  sendgrid: SendgridMailProvider,
};

container.registerSingleton<IMailProvider>(
  "MailProvider",
  mailProvider[MAIL_PROVIDER]
);
