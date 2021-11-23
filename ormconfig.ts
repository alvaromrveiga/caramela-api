import { databaseConfig } from "./src/config/database";

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: false,
  extra: databaseConfig.extra,
  migrations: databaseConfig.migrations,
  entities: databaseConfig.entities,
  cli: databaseConfig.cli,
};
