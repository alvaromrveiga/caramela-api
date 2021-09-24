import { Router } from "express";

import { CreateUserController } from "../../../../modules/users/useCases/createUser/CreateUserController";
import { UserController } from "../../../../modules/users/useCases/UserController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";
import { petsRoutes } from "./pets.routes";

const router = Router();
const userController = new UserController();

router.post("/signup", new CreateUserController().handle);
router.post("/login", userController.logIn);
router.post("/users/logout", ensureAuthenticated, userController.logOut);
router.post("/users/logout-all", ensureAuthenticated, userController.logOutAll);
router.get("/users/profile", ensureAuthenticated, userController.showSelf);
router.get("/users/:id", ensureAuthenticated, userController.show);
router.put("/users/profile", ensureAuthenticated, userController.update);
router.delete("/users/profile", ensureAuthenticated, userController.deleteUser);

router.use(petsRoutes);

export { router };
