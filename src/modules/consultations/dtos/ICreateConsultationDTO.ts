export interface ICreateConsultationDTO {
  pet_id: string;
  veterinary: string;
  motive: string;
  weight_kg?: number;
  vaccines?: string;
  comments?: string;
}
