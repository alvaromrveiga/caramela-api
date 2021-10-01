import { Router } from "express";

import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { DeleteUserController } from "../../../../modules/users/useCases/deleteUser/DeleteUserController";
import { LoginUserController } from "../../../../modules/users/useCases/loginUser/LoginUserController";
import { LogoutAllUserController } from "../../../../modules/users/useCases/logoutAllUser/LogoutAllUserController";
import { LogoutUserController } from "../../../../modules/users/useCases/logoutUser/LogoutUserController";
import { ShowPrivateUserController } from "../../../../modules/users/useCases/showPrivateUser/ShowPrivateUserController";
import { ShowPublicUserController } from "../../../../modules/users/useCases/showPublicUser/ShowPublicUserController";
import { UpdateUserController } from "../../../../modules/users/useCases/updateUser/UpdateUserController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const usersRoutes = Router();

usersRoutes.post("/signup", new CreateUserController().handle);
usersRoutes.post("/login", new LoginUserController().handle);

usersRoutes.use(ensureAuthenticated);

usersRoutes.post("/users/logout", new LogoutUserController().handle);

usersRoutes.post("/users/logout-all", new LogoutAllUserController().handle);

usersRoutes.get("/users/profile", new ShowPrivateUserController().handle);

usersRoutes.get("/users/:id", new ShowPublicUserController().handle);

usersRoutes.put("/users/profile", new UpdateUserController().handle);

usersRoutes.delete("/users/profile", new DeleteUserController().handle);

export { usersRoutes };
