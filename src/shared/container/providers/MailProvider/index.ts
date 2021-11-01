import { container, InjectionToken } from "tsyringe";

import { IMailProvider } from "./IMailProvider";
import { EtherealMailProvider } from "./implementations/EtherealMailProvider";

interface IMailProviderMap {
  [key: string]: InjectionToken<IMailProvider>;
}

const mailProvider: IMailProviderMap = {
  ethereal: EtherealMailProvider,
};

const provider = process.env.MAIL_PROVIDER || "ethereal";

container.registerSingleton<IMailProvider>(
  "MailProvider",
  mailProvider[provider]
);
