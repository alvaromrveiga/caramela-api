import { container } from "tsyringe";

import { PetsRepository } from "../../modules/pets/infra/typeorm/repositories/PetsRepository";
import { IPetsRepository } from "../../modules/pets/repositories/IPetsRepository";

container.registerSingleton<IPetsRepository>("PetsRepository", PetsRepository);
