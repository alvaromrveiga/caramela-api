import { User } from "../modules/users/infra/typeorm/entities/User";
import { IUsersRepository } from "../modules/users/repositories/IUsersRepository";
import { AuthenticationError } from "../shared/errors/AuthenticationError";

export async function getValidatedUser(
  userId: string,
  userRepository: IUsersRepository
): Promise<User> {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AuthenticationError();
  }

  return user;
}
