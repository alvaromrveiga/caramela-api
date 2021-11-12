import { ICreateConsultationDTO } from "../../dtos/ICreateConsultationDTO";
import { Consultation } from "../../infra/typeorm/entities/Consultation";
import { IConsultationsRepository } from "../IConsultationsRepository";

export class InMemoryConsultationsRepository
  implements IConsultationsRepository
{
  private consultationsRepository: Consultation[];

  constructor() {
    this.consultationsRepository = [];
  }

  async createAndSave(data: ICreateConsultationDTO): Promise<Consultation> {
    const consultation = new Consultation(data);

    Object.assign(consultation, { created_at: new Date() });

    this.consultationsRepository.push(consultation);

    return consultation;
  }

  async findById(consultationId: string): Promise<Consultation | undefined> {
    return this.consultationsRepository.find((consultation) => {
      return consultation.id === consultationId;
    });
  }

  async findAllByPetId(petId: string): Promise<Consultation[]> {
    return this.consultationsRepository.filter((consultation) => {
      return consultation.pet_id === petId;
    });
  }
}
