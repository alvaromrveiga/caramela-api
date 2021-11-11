import { inject, injectable } from "tsyringe";

import { getValidatedPet } from "../../../../shared/utils/getValidatedPet";
import { IPetsRepository } from "../../../pets/repositories/IPetsRepository";
import { Appointment } from "../../infra/typeorm/entities/Appointment";
import { IAppointmentsRepository } from "../../repositories/IAppointmentsRepository";

@injectable()
export class ShowAllAppointmentsUseCase {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,

    @inject("PetsRepository")
    private petsRepository: IPetsRepository
  ) {}

  async execute(userId: string, petId: string): Promise<Appointment[]> {
    await getValidatedPet(userId, petId, this.petsRepository);

    const appointments = await this.appointmentsRepository.findAllByPetId(
      petId
    );

    return appointments;
  }
}
