import { Router } from "express";
import multer from "multer";

import { CreatePetController } from "../../../../modules/pets/useCases/createPet/CreatePetController";
import { DeletePetController } from "../../../../modules/pets/useCases/deletePet/DeletePetController";
import { ShowAllPetsController } from "../../../../modules/pets/useCases/showAllPets/ShowAllPetsController";
import { ShowPetController } from "../../../../modules/pets/useCases/showPet/ShowPetController";
import { UpdatePetController } from "../../../../modules/pets/useCases/updatePet/UpdatePetController";
import { UpdatePetAvatarController } from "../../../../modules/pets/useCases/updatePetAvatar/UpdatePetAvatarController";
import uploadConfig from "../../../../utils/upload";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const petsRoutes = Router();

const uploadAvatar = multer(uploadConfig);

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

petsRoutes.get(
  "/users/pets/:pet",
  ensureAuthenticated,
  new ShowPetController().handle
);

petsRoutes.delete(
  "/users/pets/:pet",
  ensureAuthenticated,
  new DeletePetController().handle
);

petsRoutes.put(
  "/users/pets/:pet",
  ensureAuthenticated,
  new UpdatePetController().handle
);

petsRoutes.patch(
  "/users/pets/:pet/avatar",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  new UpdatePetAvatarController().handle
);

export { petsRoutes };
