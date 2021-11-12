import { container } from "tsyringe";

import "./providers/StorageProvider";
import "./providers/MailProvider";

import { UsersTokensRepository } from "../../modules/authentication/infra/repositories/UsersTokensRepository";
import { IUsersTokensRepository } from "../../modules/authentication/repositories/IUsersTokensRepository";
import { ConsultationsRepository } from "../../modules/consultations/infra/typeorm/repositories/ConsultationsRepository";
import { IConsultationsRepository } from "../../modules/consultations/repositories/IConsultationsRepository";
import { PetsRepository } from "../../modules/pets/infra/typeorm/repositories/PetsRepository";
import { IPetsRepository } from "../../modules/pets/repositories/IPetsRepository";
import { UsersRepository } from "../../modules/users/infra/typeorm/repositories/UsersRepository";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IUsersTokensRepository>(
  "UsersTokensRepository",
  UsersTokensRepository
);

container.registerSingleton<IPetsRepository>("PetsRepository", PetsRepository);

container.registerSingleton<IConsultationsRepository>(
  "ConsultationsRepository",
  ConsultationsRepository
);
