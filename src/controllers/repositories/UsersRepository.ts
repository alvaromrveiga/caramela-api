import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { generateAuthToken } from "../../middleware/authentication";
import { User } from "../../models/User";
import { hashPasswordAsync } from "../../utils/bcrypt";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  static get instance(): UsersRepository {
    return getCustomRepository(this);
  }

  createAndSave = async (body: User) => {
    const user = this.create(body);

    user.password = await hashPasswordAsync(user.password);

    generateAuthToken(user);

    await this.save(user);

    return { status: 201, message: this.getUserCredentials(user) };
  };

  showPublic = async (id: string) => {
    const user = await this.findOne({ id });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    return {
      status: 200,
      message: this.getPublicUserCredentials(user),
    };
  };

  showSelf = async (id: string) => {
    const user = await this.findOne({ id });

    if (!user) {
      return {
        status: 401,
        message: "Please authenticate",
      };
    }

    return {
      status: 200,
      message: this.getUserCredentials(user),
    };
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
