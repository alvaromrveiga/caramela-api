import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "../../dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { UserTokens } from "../entities/UserTokens";

export class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async createAndSave(data: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = this.repository.create(data);

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserTokens | undefined> {
    return this.repository.findOne({
      where: [
        {
          user_id: userId,
          refresh_token: refreshToken,
        },
      ],
    });
  }

  async findByUserAndMachineInfo(
    userId: string,
    machineInfo: string
  ): Promise<UserTokens | undefined> {
    return this.repository.findOne({
      where: [
        {
          user_id: userId,
          machine_info: machineInfo,
        },
      ],
    });
  }

  async findByRefreshToken(
    refreshToken: string
  ): Promise<UserTokens | undefined> {
    return this.repository.findOne({ refresh_token: refreshToken });
  }

  findByUserId(userId: string): Promise<UserTokens[]> {
    return this.repository.find({ user_id: userId });
  }

  async deleteById(tokenId: string): Promise<void> {
    await this.repository.delete({ id: tokenId });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const userTokens = await this.repository.find({ user_id: userId });
    await this.repository.remove(userTokens);
  }
}
