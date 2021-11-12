import { inject, injectable } from "tsyringe";

import { getValidatedPet } from "../../../../shared/utils/getValidatedPet";
import { IPetsRepository } from "../../../pets/repositories/IPetsRepository";
import { Consultation } from "../../infra/typeorm/entities/Consultation";
import { IConsultationsRepository } from "../../repositories/IConsultationsRepository";

@injectable()
export class ShowAllConsultationsUseCase {
  constructor(
    @inject("ConsultationsRepository")
    private consultationsRepository: IConsultationsRepository,

    @inject("PetsRepository")
    private petsRepository: IPetsRepository
  ) {}

  async execute(userId: string, petId: string): Promise<Consultation[]> {
    await getValidatedPet(userId, petId, this.petsRepository);

    const consultations = await this.consultationsRepository.findAllByPetId(
      petId
    );

    return consultations;
  }
}
