import { Connection } from "typeorm";

import { UsersRepository } from "../../src/modules/users/infra/typeorm/repositories/UsersRepository";
import createConnection from "../../src/shared/infra/typeorm/connection";

let connection: Connection;

export const resetDatabase = async () => {
  const allUsers = await UsersRepository.instance.find();
  await UsersRepository.instance.remove(allUsers);
};

export const connect = async () => {
  if (!connection) {
    connection = await createConnection();
    await connection.runMigrations();
  }

  return connection;
};
