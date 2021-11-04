import { User } from "../../modules/users/infra/typeorm/entities/User";

export function getResetPasswordTokenSecret(user: User): string {
  const hashedPassword = user.password;

  return hashedPassword + user.created_at.getTime();
}
