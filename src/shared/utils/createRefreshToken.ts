import dayjs from "dayjs";
import jwt from "jsonwebtoken";

import {
  refreshTokenExpiresInDays,
  refreshTokenSecret,
} from "../../config/auth";
import { IUsersTokensRepository } from "../../modules/authentication/repositories/IUsersTokensRepository";
import { User } from "../../modules/users/infra/typeorm/entities/User";

export async function createRefreshToken(
  user: User,
  usersTokensRepository: IUsersTokensRepository,
  machineInfo?: string
): Promise<string> {
  const refresh_token = jwt.sign({ email: user.email }, refreshTokenSecret, {
    subject: user.id,
    expiresIn: `${refreshTokenExpiresInDays}d`,
  });

  const refreshTokenExpirationDate = dayjs()
    .add(refreshTokenExpiresInDays, "day")
    .toDate();

  await usersTokensRepository.createAndSave({
    user_id: user.id,
    refresh_token,
    expiration_date: refreshTokenExpirationDate,
    machine_info: machineInfo,
  });

  return refresh_token;
}
