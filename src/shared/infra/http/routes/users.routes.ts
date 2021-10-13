import { Router } from "express";
import multer from "multer";

import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { DeleteUserController } from "../../../../modules/users/useCases/deleteUser/DeleteUserController";
import { LoginUserController } from "../../../../modules/users/useCases/loginUser/LoginUserController";
import { LogoutAllUserController } from "../../../../modules/users/useCases/logoutAllUser/LogoutAllUserController";
import { LogoutUserController } from "../../../../modules/users/useCases/logoutUser/LogoutUserController";
import { ShowPrivateUserController } from "../../../../modules/users/useCases/showPrivateUser/ShowPrivateUserController";
import { ShowPublicUserController } from "../../../../modules/users/useCases/showPublicUser/ShowPublicUserController";
import { UpdateUserController } from "../../../../modules/users/useCases/updateUser/UpdateUserController";
import { UpdateUserAvatarController } from "../../../../modules/users/useCases/updateUserAvatar/UpdateUserAvatarController";
import uploadConfig from "../../../../utils/upload";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

usersRoutes.post("/signup", new CreateUserController().handle);
usersRoutes.post("/login", new LoginUserController().handle);

usersRoutes.post(
  "/users/logout",
  ensureAuthenticated,
  new LogoutUserController().handle
);

usersRoutes.post(
  "/users/logout-all",
  ensureAuthenticated,
  new LogoutAllUserController().handle
);

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
  uploadAvatar.single("avatar"),
  new UpdateUserAvatarController().handle
);

usersRoutes.delete(
  "/users/profile",
  ensureAuthenticated,
  new DeleteUserController().handle
);

export { usersRoutes };
