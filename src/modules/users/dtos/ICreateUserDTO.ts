export interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  tokens?: string[];
}
