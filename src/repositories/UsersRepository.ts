import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { User } from "../models/User";
import { ErrorWithStatus } from "../utils/ErrorWithStatus";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  static get instance(): UsersRepository {
    return getCustomRepository(this);
  }

  deleteUser = async (id: string) => {
    const user = await this.delete({ id });

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }

    return true;
  };

  getUserCredentials = (user: User) => {
    return {
      created_at: user.created_at,
      email: user.email,
      name: user.name,
      tokens: user.tokens,
    };
  };

  getPublicUserCredentials = (user: User) => {
    return {
      created_at: user.created_at,
      name: user.name,
    };
  };
}
