import { container } from "tsyringe";

import "./providers/StorageProvider";

import { PetsRepository } from "../../modules/pets/infra/typeorm/repositories/PetsRepository";
import { IPetsRepository } from "../../modules/pets/repositories/IPetsRepository";
import { UsersRepository } from "../../modules/users/infra/typeorm/repositories/UsersRepository";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";

container.registerSingleton<IPetsRepository>("PetsRepository", PetsRepository);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);
