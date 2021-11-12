import { ICreateConsultationDTO } from "../dtos/ICreateConsultationDTO";
import { Consultation } from "../infra/typeorm/entities/Consultation";

export interface IConsultationsRepository {
  createAndSave(data: ICreateConsultationDTO): Promise<Consultation>;

  findById(consultationId: string): Promise<Consultation | undefined>;

  findAllByPetId(petId: string): Promise<Consultation[]>;
}
