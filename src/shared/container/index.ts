import { container } from "tsyringe";

import "./providers/StorageProvider";
import "./providers/MailProvider";

import { AppointmentsRepository } from "../../modules/appointments/infra/typeorm/repositories/AppointmentsRepository";
import { IAppointmentsRepository } from "../../modules/appointments/repositories/IAppointmentsRepository";
import { PetsRepository } from "../../modules/pets/infra/typeorm/repositories/PetsRepository";
import { IPetsRepository } from "../../modules/pets/repositories/IPetsRepository";
import { UsersRepository } from "../../modules/users/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "../../modules/users/infra/typeorm/repositories/UsersTokensRepository";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../modules/users/repositories/IUsersTokensRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IUsersTokensRepository>(
  "UsersTokensRepository",
  UsersTokensRepository
);

container.registerSingleton<IPetsRepository>("PetsRepository", PetsRepository);

container.registerSingleton<IAppointmentsRepository>(
  "AppointmentsRepository",
  AppointmentsRepository
);
