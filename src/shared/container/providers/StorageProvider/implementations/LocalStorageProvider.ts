import fs from "fs";
import { resolve, join } from "path";

import { tmpFolder } from "../../../../../utils/upload";
import { IStorageProvider } from "../IStorageProvider";

export class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    this.createFolderIfNotExists(folder);

    const oldFilePath = resolve(tmpFolder, file);

    const newFilePath = resolve(`${tmpFolder}/${folder}`, file);

    await fs.promises.rename(oldFilePath, newFilePath);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const fileName = resolve(`${tmpFolder}/${folder}`, file);

    if (fs.existsSync(fileName)) {
      await fs.promises.unlink(fileName);
    }
  }

  private createFolderIfNotExists(folder: string) {
    const path = join(tmpFolder, folder);

    if (!fs.existsSync(join(tmpFolder, folder))) {
      fs.mkdirSync(path, { recursive: true });
    }
  }
}
