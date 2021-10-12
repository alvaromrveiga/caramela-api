import { container, InjectionToken } from "tsyringe";

import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { IStorageProvider } from "./IStorageProvider";

interface IStorageMap {
  [key: string]: InjectionToken<IStorageProvider>;
}

const diskStorage: IStorageMap = {
  local: LocalStorageProvider,
};

const storage = process.env.STORAGE || "local";

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  diskStorage[storage]
);
