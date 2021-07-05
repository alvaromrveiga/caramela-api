import { Connection, createConnection } from "typeorm";
import { UsersRepository } from "../../src/repositories/UsersRepository";

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
