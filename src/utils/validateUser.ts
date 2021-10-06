import { IUsersRepository } from "../modules/users/repositories/IUsersRepository";
import { ErrorWithStatus } from "./ErrorWithStatus";

export async function validateUser(
  userId: string,
  userRepository: IUsersRepository
): Promise<void> {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new ErrorWithStatus(401, "Please authenticate");
  }
}
