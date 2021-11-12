import { inject, injectable } from "tsyringe";

import { getValidatedPet } from "../../../../shared/utils/getValidatedPet";
import { IPetsRepository } from "../../../pets/repositories/IPetsRepository";
import { ICreateConsultationDTO } from "../../dtos/ICreateConsultationDTO";
import { Consultation } from "../../infra/typeorm/entities/Consultation";
import { IConsultationsRepository } from "../../repositories/IConsultationsRepository";
import { InvalidConsultationMotiveError } from "./errors/InvalidConsultationMotiveError";
import { InvalidVeterinaryError } from "./errors/InvalidVeterinaryError";

@injectable()
export class CreateConsultationUseCase {
  constructor(
    @inject("ConsultationsRepository")
    private consultationsRepository: IConsultationsRepository,

    @inject("PetsRepository")
    private petsRepository: IPetsRepository
  ) {}

  async execute(
    userId: string,
    data: ICreateConsultationDTO
  ): Promise<Consultation> {
    await this.validateCredentials(userId, data);

    const consultation = await this.consultationsRepository.createAndSave(data);

    await this.updatePetWeight(userId, data);

    return consultation;
  }

  private async validateCredentials(
    userId: string,
    data: ICreateConsultationDTO
  ): Promise<void> {
    await getValidatedPet(userId, data.pet_id, this.petsRepository);

    this.validateMotive(data.motive);

    this.validateVeterinary(data.veterinary);
  }

  private async updatePetWeight(
    userId: string,
    data: ICreateConsultationDTO
  ): Promise<void> {
    const pet = await getValidatedPet(userId, data.pet_id, this.petsRepository);

    if (data.weight_kg) {
      pet.weight_kg = data.weight_kg;
      await this.petsRepository.createAndSave(pet);
    }
  }

  private validateMotive(motive: string): void {
    if (!motive) {
      throw new InvalidConsultationMotiveError();
    }
  }

  private validateVeterinary(veterinary: string): void {
    if (!veterinary) {
      throw new InvalidVeterinaryError();
    }
  }
}
