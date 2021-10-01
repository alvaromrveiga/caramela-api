import { container } from "tsyringe";

import { PetsRepository } from "../../modules/pets/infra/typeorm/repositories/PetsRepository";
import { IPetsRepository } from "../../modules/pets/repositories/IPetsRepository";
import { UsersRepositoryNew } from "../../modules/users/infra/typeorm/repositories/UsersRepositoryNew";
import { IUsersRepository } from "../../modules/users/repositories/IUsersRepository";

container.registerSingleton<IPetsRepository>("PetsRepository", PetsRepository);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepositoryNew
);
