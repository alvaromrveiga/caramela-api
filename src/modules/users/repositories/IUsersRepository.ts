import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../infra/typeorm/entities/User";

export interface IUsersRepository {
  createAndSave(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
}
