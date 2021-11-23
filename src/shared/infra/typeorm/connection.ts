import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  let host;
  let database;

  if (process.env.NODE_ENV === "test") {
    host = "localhost";
    database = "caramela_test";
  } else if (process.env.NODE_ENV === "prod") {
    return createConnection(defaultOptions);
  } else {
    host = "database-caramela";
    database = "caramela";
  }

  Object.assign(defaultOptions, {
    host,
    database,
  });

  return createConnection(defaultOptions);
};
