const pgConnectionString = require("pg-connection-string");

if (process.env.DATABASE_URL) {
  const databaseConfig = pgConnectionString.parse(process.env.DATABASE_URL);
  console.log(databaseConfig);
  const ormConfig = {
    type: "postgres",
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    ssl: false,
    extra: {},
    migrations: ["./src/shared/infra/typeorm/migrations/**.ts"],
    entities: ["./src/modules/**/entities/**.ts"],
    cli: {
      migrationsDir: "./src/shared/infra/typeorm/migrations",
    },
  };

  if (process.env.NODE_ENV === "prod") {
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

  console.log(ormConfig);
  module.exports = { ...ormConfig };
}
