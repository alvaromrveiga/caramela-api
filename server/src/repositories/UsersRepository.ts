import { EntityRepository, Repository } from "typeorm";
import { User } from "../models/User";
import { hashPasswordAsync } from "../utils/bcrypt";
import { generateAuthToken } from "../middleware/authentication";

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  createAndSave = async (body: User) => {
    if (await this.isEmailInUse(body.email)) {
      return { responseStatus: 400, message: "E-mail already in use" };
    }

    if (!this.isPasswordValid(body.password)) {
      return { responseStatus: 400, message: "Password not valid" };
    }

    const user = this.create(body);

    user.password = await hashPasswordAsync(user.password);

    generateAuthToken(user);

    await this.save(user);

    return { responseStatus: 201, message: this.getUserCredentials(user) };
  };

  showPublic = async (id: string) => {
    const user = await this.findOne({ id });

    if (!user) {
      return { responseStatus: 404, message: "User not found" };
    }

    return {
      responseStatus: 200,
      message: this.getPublicUserCredentials(user),
    };
  };

  private isEmailInUse = async (email: string) => {
    if (await this.findOne({ email: email })) {
      return true;
    }
    return false;
  };

  private isPasswordValid = (password: string) => {
    if (password.length >= 8) {
      return true;
    }
    return false;
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
