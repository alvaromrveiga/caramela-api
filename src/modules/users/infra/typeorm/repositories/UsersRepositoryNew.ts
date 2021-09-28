import { EntityRepository, getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../entities/User";

@EntityRepository(User)
export class UsersRepositoryNew implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async createAndSave(data: ICreateUserDTO): Promise<void> {
    const user = this.repository.create(data);

    this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ email });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.repository.findOne(id);
  }

  async delete(id: string): Promise<void> {
    this.repository.delete(id);
  }
}
