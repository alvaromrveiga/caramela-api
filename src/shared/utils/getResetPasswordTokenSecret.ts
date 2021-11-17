import { User } from "../../modules/users/infra/typeorm/entities/User";

export function getResetPasswordTokenSecret(user: User): string {
  // https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
  const hashedPassword = user.password;

  return hashedPassword + user.created_at.getTime();
}
