const pgConnectionString = require("pg-connection-string");

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

if (process.env.NODE_ENV === "prod") {
  const databaseConfig = pgConnectionString.parse(process.env.DATABASE_URL);

  ormConfig.host = databaseConfig.host;
  ormConfig.port = databaseConfig.port;
  ormConfig.username = databaseConfig.user;
  ormConfig.password = databaseConfig.password;
  ormConfig.database = databaseConfig.database;
  ormConfig.ssl = true;
  ormConfig.extra = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
  ormConfig.migrations = ["./dist/src/shared/infra/typeorm/migrations/**.js"];
  ormConfig.entities = ["./dist/src/modules/**/entities/**.js"];
  ormConfig.cli.migrationsDir = ".dist/src/shared/infra/typeorm/migrations";
}

module.exports = { ...ormConfig };
