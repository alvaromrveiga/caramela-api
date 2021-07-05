import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { User } from "../models/User";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  static get instance(): UsersRepository {
    return getCustomRepository(this);
  }

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
