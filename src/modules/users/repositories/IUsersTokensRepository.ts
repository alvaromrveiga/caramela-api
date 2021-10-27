import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserTokens } from "../infra/typeorm/entities/UserTokens";

export interface IUsersTokensRepository {
  createAndSave(data: ICreateUserTokenDTO): Promise<UserTokens>;

  findByUserAndRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<UserTokens>;

  findByRefreshToken(refreshToken: string): Promise<UserTokens>;

  deleteById(tokenId: string): void;

  deleteAll(): void;
}
