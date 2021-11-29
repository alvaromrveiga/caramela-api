import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../infra/entities/UserTokens";

export interface IUsersTokensRepository {
  createAndSave(data: ICreateUserTokenDTO): Promise<UserTokens>;

  findByUserAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserTokens | undefined>;

  findByUserAndMachineInfo(
    userId: string,
    machineInfo: string
  ): Promise<UserTokens | undefined>;

  findByRefreshToken(refreshToken: string): Promise<UserTokens | undefined>;

  findByUserId(userId: string): Promise<UserTokens[]>;

  deleteById(tokenId: string): Promise<void>;

  deleteByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void>;

  deleteAllByUserId(userId: string): Promise<void>;
}
