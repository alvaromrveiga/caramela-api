import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { User } from "../../models/User";
import { hashPasswordAsync } from "../../utils/bcrypt";
import { generateAuthToken } from "../../middleware/authentication";
import { v4 as uuidv4 } from "uuid";

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  static get instance(): UsersRepository {
    return getCustomRepository(this);
  }

  createAndSave = async (body: User) => {
    const user = this.create(body);

    user.id = uuidv4();
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

  private getUserCredentials = (user: User) => {
    const newUser = new User();

    newUser.created_at = user.created_at;
    newUser.email = user.email;
    newUser.name = user.name;
    newUser.tokens = user.tokens;

    return newUser;
  };

  private getPublicUserCredentials = (user: User) => {
    const newUser = new User();

    newUser.created_at = user.created_at;
    newUser.name = user.name;

    return newUser;
  };
}
export { UsersRepository };