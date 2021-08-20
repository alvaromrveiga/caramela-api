import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  
  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === "test" ? "localhost" : "database-caramela",
      database:
        process.env.NODE_ENV === "test"
          ? "database-caramela_test"
          : defaultOptions.database,
    })
  );
};
