import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { ErrorWithStatus } from "../../utils/ErrorWithStatus";
import { generateAuthToken } from "../../middleware/authentication";
import { User } from "../../models/User";
import { hashPasswordAsync } from "../../utils/bcrypt";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  static get instance(): UsersRepository {
    return getCustomRepository(this);
  }

  createAndSave = async (body: {
    name: string;
    email: string;
    password: string;
  }) => {
    const user = this.create(body);

    user.password = await hashPasswordAsync(user.password);

    generateAuthToken(user);

    await this.save(user);

    return this.getUserCredentials(user);
  };

  showPublic = async (id: string) => {
    const user = await this.findOne(id);

    if (!user) {
      throw new ErrorWithStatus(404, "User not found");
    }

    return this.getPublicUserCredentials(user);
  };

  showSelf = async (id: string) => {
    const user = await this.findOne({ id });

    if (!user) {
      throw new ErrorWithStatus(401, "Please authenticate");
    }

    return this.getUserCredentials(user);
  };

  private getUserCredentials = (user: User) => {
    return {
      created_at: user.created_at,
      email: user.email,
      name: user.name,
      tokens: user.tokens,
    };
  };

  private getPublicUserCredentials = (user: User) => {
    return {
      created_at: user.created_at,
      name: user.name,
    };
  };
}
