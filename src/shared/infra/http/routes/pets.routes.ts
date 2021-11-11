import { Router } from "express";

import { CreatePetController } from "../../../../modules/pets/useCases/createPet/CreatePetController";
import { DeletePetController } from "../../../../modules/pets/useCases/deletePet/DeletePetController";
import { ShowAllPetsController } from "../../../../modules/pets/useCases/showAllPets/ShowAllPetsController";
import { ShowPetController } from "../../../../modules/pets/useCases/showPet/ShowPetController";
import { UpdatePetController } from "../../../../modules/pets/useCases/updatePet/UpdatePetController";
import { UpdatePetAvatarController } from "../../../../modules/pets/useCases/updatePetAvatar/UpdatePetAvatarController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { upload } from "../middleware/upload";

const petsRoutes = Router();

petsRoutes.post("/pets", ensureAuthenticated, new CreatePetController().handle);

petsRoutes.get(
  "/pets",
  ensureAuthenticated,
  new ShowAllPetsController().handle
);

petsRoutes.get(
  "/pets/:id",
  ensureAuthenticated,
  new ShowPetController().handle
);

petsRoutes.delete(
  "/pets/:id",
  ensureAuthenticated,
  new DeletePetController().handle
);

petsRoutes.put(
  "/pets/:id",
  ensureAuthenticated,
  new UpdatePetController().handle
);

petsRoutes.patch(
  "/pets/:id/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  new UpdatePetAvatarController().handle
);

export { petsRoutes };
