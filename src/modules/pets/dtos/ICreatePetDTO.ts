export interface ICreatePetDTO {
  user_id: string;
  name: string;
  gender?: string;
  weight_kg?: number;
  birthday?: Date;
}
