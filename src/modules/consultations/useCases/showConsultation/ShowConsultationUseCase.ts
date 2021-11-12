import { inject, injectable } from "tsyringe";

import { IPetsRepository } from "../../../pets/repositories/IPetsRepository";
import { Consultation } from "../../infra/typeorm/entities/Consultation";
import { IConsultationsRepository } from "../../repositories/IConsultationsRepository";
import { ConsultationNotFoundError } from "./errors/ConsultationNotFoundError";

@injectable()
export class ShowConsultationUseCase {
  constructor(
    @inject("ConsultationsRepository")
    private consultationsRepository: IConsultationsRepository,

    @inject("PetsRepository")
    private petsRepository: IPetsRepository
  ) {}

  async execute(userId: string, consultationId: string): Promise<Consultation> {
    const consultation = await this.consultationsRepository.findById(
      consultationId
    );

    if (!consultation) {
      throw new ConsultationNotFoundError();
    }

    await this.checkIfUserOwnsPet(userId, consultation.pet_id);

    return consultation;
  }

  private async checkIfUserOwnsPet(
    userId: string,
    petId: string
  ): Promise<void> {
    const pet = await this.petsRepository.findByUserAndPetId(userId, petId);

    if (!pet) {
      throw new ConsultationNotFoundError();
    }
  }
}
