import fs from "fs";
import { resolve, join } from "path";

import upload from "../../../../../utils/upload";
import { IStorageProvider } from "../IStorageProvider";

export class LocalStorageProvider implements IStorageProvider {
  async save(file: string, folder: string): Promise<string> {
    this.createFolderIfNotExists(folder);

    const oldFilePath = resolve(upload.tmpFolder, file);

    const newFilePath = resolve(`${upload.tmpFolder}/${folder}`, file);

    await fs.promises.rename(oldFilePath, newFilePath);

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const fileName = resolve(`${upload.tmpFolder}/${folder}`, file);

    await fs.promises.unlink(fileName);
  }

  private createFolderIfNotExists(folder: string) {
    const path = join(upload.tmpFolder, folder);

    if (!fs.existsSync(join(upload.tmpFolder, folder))) {
      console.log("Created");

      fs.mkdirSync(path, { recursive: true });
    }
  }
}
