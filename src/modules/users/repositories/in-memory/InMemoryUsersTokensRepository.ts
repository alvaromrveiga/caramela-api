import { ICreateUserTokenDTO } from "../../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../../infra/typeorm/entities/UserTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";

export class InMemoryUsersTokensRepository implements IUsersTokensRepository {
  private usersTokens: UserTokens[];

  constructor() {
    this.usersTokens = [];
  }

  async createAndSave(data: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();
    Object.assign(userToken, data);

    return userToken;
  }

  async findByUserAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserTokens | undefined> {
    return this.usersTokens.find((userToken) => {
      return (
        userToken.user_id === userId && userToken.refresh_token === refreshToken
      );
    });
  }

  async findByUserAndMachineInfo(
    userId: string,
    machineInfo: string
  ): Promise<UserTokens | undefined> {
    return this.usersTokens.find((userToken) => {
      return (
        userToken.user_id === userId && userToken.machine_info === machineInfo
      );
    });
  }

  async findByRefreshToken(
    refreshToken: string
  ): Promise<UserTokens | undefined> {
    return this.usersTokens.find((userToken) => {
      return userToken.refresh_token === refreshToken;
    });
  }

  async deleteById(tokenId: string): Promise<void> {
    const tokenIndex = this.usersTokens.findIndex((userToken) => {
      return userToken.id === tokenId;
    });

    this.usersTokens.splice(1, tokenIndex);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    this.usersTokens = this.usersTokens.filter((userToken) => {
      return userToken.id !== userId;
    });
  }
}
