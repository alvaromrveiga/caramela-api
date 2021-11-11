import { Router } from "express";

import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { DeleteUserController } from "../../../../modules/users/useCases/deleteUser/DeleteUserController";
import { ShowPrivateUserController } from "../../../../modules/users/useCases/showPrivateUser/ShowPrivateUserController";
import { ShowPublicUserController } from "../../../../modules/users/useCases/showPublicUser/ShowPublicUserController";
import { UpdateUserController } from "../../../../modules/users/useCases/updateUser/UpdateUserController";
import { UpdateUserAvatarController } from "../../../../modules/users/useCases/updateUserAvatar/UpdateUserAvatarController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { upload } from "../middleware/upload";

const usersRoutes = Router();

usersRoutes.post("/signup", new CreateUserController().handle);

usersRoutes.get(
  "/users/profile",
  ensureAuthenticated,
  new ShowPrivateUserController().handle
);

usersRoutes.get(
  "/users/:id",
  ensureAuthenticated,
  new ShowPublicUserController().handle
);

usersRoutes.put(
  "/users/profile",
  ensureAuthenticated,
  new UpdateUserController().handle
);

usersRoutes.patch(
  "/users/profile/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  new UpdateUserAvatarController().handle
);

usersRoutes.delete(
  "/users/profile",
  ensureAuthenticated,
  new DeleteUserController().handle
);

export { usersRoutes };
