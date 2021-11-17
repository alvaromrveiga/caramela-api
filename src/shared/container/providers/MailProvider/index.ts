import { container, InjectionToken } from "tsyringe";

import { MAIL_PROVIDER } from "../../../../config/providers";
import { IMailProvider } from "./IMailProvider";
import { EtherealMailProvider } from "./implementations/EtherealMailProvider";

interface IMailProviderMap {
  [key: string]: InjectionToken<IMailProvider>;
}

const mailProvider: IMailProviderMap = {
  ethereal: EtherealMailProvider,
};

container.registerSingleton<IMailProvider>(
  "MailProvider",
  mailProvider[MAIL_PROVIDER]
);
