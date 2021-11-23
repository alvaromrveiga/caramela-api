const databaseConfig = {
  ssl: false,
  extra: {},
  migrations: ["./src/shared/infra/typeorm/migrations/**.ts"],
  entities: ["./src/modules/**/entities/**.ts"],
  cli: {
    migrationsDir: "./src/shared/infra/typeorm/migrations",
  },
};

if (process.env.NODE_ENV === "prod") {
  databaseConfig.ssl = true;
  databaseConfig.extra = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
  databaseConfig.migrations = [
    "./dist/src/shared/infra/typeorm/migrations/**.js",
  ];
  databaseConfig.entities = ["./dist/src/modules/**/entities/**.js"];
  databaseConfig.cli.migrationsDir =
    ".dist/src/shared/infra/typeorm/migrations";
}

export { databaseConfig };
