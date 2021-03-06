import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async createAndSave(data: ICreateUserDTO): Promise<User> {
    const user = new User({
      ...data,
      email: data.email.toLowerCase(),
    });

    Object.assign(user, { created_at: new Date(), updated_at: new Date() });

    const userAlreadyExistsIndex = this.users.findIndex((user) => {
      return user.email === data.email;
    });

    if (userAlreadyExistsIndex >= 0) {
      this.users[userAlreadyExistsIndex] = user;
    } else {
      this.users.push(user);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => {
      return user.email === email.toLowerCase();
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => {
      return user.id === id;
    });
  }

  async delete(id: string): Promise<void> {
    const userId = this.users.findIndex((user) => {
      return user.id === id;
    });

    this.users.splice(userId, 1);
  }
}
