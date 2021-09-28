import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async createAndSave(data: ICreateUserDTO): Promise<void> {
    const user = new User();
    Object.assign(user, data);

    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => {
      return user.email === email;
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => {
      return user.id === id;
    });
  }
}
