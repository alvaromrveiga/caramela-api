import { Router } from "express";

import { CreatePetController } from "../../../../modules/pets/useCases/createPet/CreatePetController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const petsRoutes = Router();

petsRoutes.post(
  "/users/pets",
  ensureAuthenticated,
  new CreatePetController().handle
);

export { petsRoutes };
