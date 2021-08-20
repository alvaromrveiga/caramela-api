module.exports = {
  type: "postgres",
  host: "localhost",
  port: "5432",
  username: "postgres",
  password: "docker",
  database: "caramela",
  migrations: ["./src/migrations/**.ts"],
  entities: ["./src/models/**.ts"],
  cli: {
    migrationsDir: "./src/migrations",
  },
};
