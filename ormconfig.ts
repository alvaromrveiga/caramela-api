import { parse } from "pg-connection-string";

import { isDeploy } from "./src/shared/utils/isDeploy";

const ormConfig = {
  type: "postgres",
  host: "localhost",
  port: "5432",
  username: "postgres",
  password: "docker",
  database: "caramela",
  ssl: false,
  extra: {},
  migrations: ["./src/shared/infra/typeorm/migrations/**.ts"],
  entities: ["./src/modules/**/entities/**.ts"],
  cli: {
    migrationsDir: "./src/shared/infra/typeorm/migrations",
  },
};

const databaseURL = isDeploy();
if (databaseURL) {
  const databaseConfig = parse(databaseURL);

  ormConfig.host = databaseConfig.host || ormConfig.host;
  ormConfig.port = databaseConfig.port || ormConfig.port;
  ormConfig.username = databaseConfig.user || ormConfig.username;
  ormConfig.password = databaseConfig.password || ormConfig.password;
  ormConfig.database = databaseConfig.database || ormConfig.database;
  ormConfig.ssl = true;
  ormConfig.extra = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

module.exports = { ...ormConfig };
