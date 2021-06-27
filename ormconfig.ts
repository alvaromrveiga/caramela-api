module.exports = {
  type: "postgres",
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: process.env.TYPEORM_LOGGING === "true",
  migrations: ["./src/migrations/**.ts"],
  entities: ["./src/models/**.ts"],
  cli: {
    migrationsDir: "./src/migrations",
  },
};
