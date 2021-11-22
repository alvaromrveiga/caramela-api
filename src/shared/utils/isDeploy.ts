export function isDeploy(): string | undefined {
  return process.env.DATABASE_URL;
}
