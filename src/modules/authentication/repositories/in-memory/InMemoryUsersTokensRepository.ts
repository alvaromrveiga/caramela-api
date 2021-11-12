import { ICreateUserTokenDTO } from "../../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../../infra/entities/UserTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";

export class InMemoryUsersTokensRepository implements IUsersTokensRepository {
  private usersTokens: UserTokens[];

  constructor() {
    this.usersTokens = [];
  }

  async createAndSave(data: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens(data);

    this.usersTokens.push(userToken);
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

  async findByUserId(userId: string): Promise<UserTokens[]> {
    return this.usersTokens.filter((userToken) => {
      return userToken.user_id === userId;
    });
  }

  async deleteById(tokenId: string): Promise<void> {
    const tokenIndex = this.usersTokens.findIndex((userToken) => {
      return userToken.id === tokenId;
    });

    this.usersTokens.splice(tokenIndex, 1);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    this.usersTokens = this.usersTokens.filter((userToken) => {
      return userToken.user_id !== userId;
    });
  }
}
