module.exports = {
  type: "postgres",
  host: "localhost",
  port: "5432",
  username: "postgres",
  password: "docker",
  database: "caramela",
  migrations: ["./src/shared/infra/typeorm/migrations/**.ts"],
  entities: ["./src/modules/**/entities/**.ts"],
  cli: {
    migrationsDir: "./src/migrations",
  },
};
