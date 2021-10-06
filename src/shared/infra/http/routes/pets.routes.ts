import { Router } from "express";

import { CreatePetController } from "../../../../modules/pets/useCases/createPet/CreatePetController";
import { ShowAllPetsController } from "../../../../modules/pets/useCases/showAllPets/ShowAllPetsController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const petsRoutes = Router();

petsRoutes.post(
  "/users/pets",
  ensureAuthenticated,
  new CreatePetController().handle
);

petsRoutes.get(
  "/users/pets",
  ensureAuthenticated,
  new ShowAllPetsController().handle
);

export { petsRoutes };
