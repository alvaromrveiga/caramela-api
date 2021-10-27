export interface ICreateUserTokenDTO {
  user_id: string;
  refresh_token: string;
  machine_info: string;
  expiration_date: Date;
}
