import { EntityRepository, getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../entities/User";

@EntityRepository(User)
export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async createAndSave(data: ICreateUserDTO): Promise<User> {
    const user = this.repository.create(data);

    await this.repository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.repository.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
