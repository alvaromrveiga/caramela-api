import { Router } from "express";

import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { DeleteUserController } from "../../../../modules/users/useCases/deleteUser/DeleteUserController";
import { LoginUserController } from "../../../../modules/users/useCases/loginUser/LoginUserController";
import { LogoutAllUserController } from "../../../../modules/users/useCases/logoutAllUser/LogoutAllUserController";
import { LogoutUserController } from "../../../../modules/users/useCases/logoutUser/LogoutUserController";
import { ShowPrivateUserController } from "../../../../modules/users/useCases/showPrivateUser/ShowPrivateUserController";
import { ShowPublicUserController } from "../../../../modules/users/useCases/showPublicUser/ShowPublicUserController";
import { UserController } from "../../../../modules/users/useCases/UserController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { petsRoutes } from "./pets.routes";

const router = Router();
const userController = new UserController();

router.post("/signup", new CreateUserController().handle);
router.post("/login", new LoginUserController().handle);

router.post(
  "/users/logout",
  ensureAuthenticated,
  new LogoutUserController().handle
);

router.post(
  "/users/logout-all",
  ensureAuthenticated,
  new LogoutAllUserController().handle
);

router.get(
  "/users/profile",
  ensureAuthenticated,
  new ShowPrivateUserController().handle
);

router.get(
  "/users/:id",
  ensureAuthenticated,
  new ShowPublicUserController().handle
);

router.put("/users/profile", ensureAuthenticated, userController.update);

router.delete(
  "/users/profile",
  ensureAuthenticated,
  new DeleteUserController().handle
);

router.use(petsRoutes);

export { router };
