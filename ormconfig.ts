const ormConfig = {
  type: "postgres",
  url: process.env.DATABASE_URL,
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
}

module.exports = { ...ormConfig };
