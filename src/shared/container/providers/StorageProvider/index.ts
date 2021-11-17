import { container, InjectionToken } from "tsyringe";

import { STORAGE_PROVIDER } from "../../../../config/providers";
import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { IStorageProvider } from "./IStorageProvider";

interface IStorageMap {
  [key: string]: InjectionToken<IStorageProvider>;
}

const diskStorage: IStorageMap = {
  local: LocalStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  diskStorage[STORAGE_PROVIDER]
);
