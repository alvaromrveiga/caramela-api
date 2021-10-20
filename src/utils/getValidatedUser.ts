import { User } from "../modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "../modules/users/repositories/IUsersRepository";
import { ErrorWithStatus } from "./ErrorWithStatus";

export async function getValidatedUser(
  userId: string,
  userRepository: IUsersRepository
): Promise<User> {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ErrorWithStatus(401, "Please authenticate");
  }

  return user;
}
