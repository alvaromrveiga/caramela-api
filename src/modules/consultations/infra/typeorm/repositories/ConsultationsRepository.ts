import { getRepository, Repository } from "typeorm";

import { ICreateConsultationDTO } from "../../../dtos/ICreateConsultationDTO";
import { IConsultationsRepository } from "../../../repositories/IConsultationsRepository";
import { Consultation } from "../entities/Consultation";

export class ConsultationsRepository implements IConsultationsRepository {
  private repository: Repository<Consultation>;

  constructor() {
    this.repository = getRepository(Consultation);
  }

  async createAndSave(data: ICreateConsultationDTO): Promise<Consultation> {
    const consultation = this.repository.create(data);

    await this.repository.save(consultation);

    return consultation;
  }

  async findById(consultationId: string): Promise<Consultation | undefined> {
    return this.repository.findOne({ id: consultationId });
  }

  async findAllByPetId(petId: string): Promise<Consultation[]> {
    return this.repository.find({ pet_id: petId });
  }
}
