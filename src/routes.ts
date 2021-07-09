import { Router } from "express";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";
import { UserController } from "./useCases/User/UserController";

const router = Router();
const userController = new UserController();

router.post("/signup", userController.create);
router.post("/login", userController.logIn);
router.post("/users/logout", ensureAuthenticated, userController.logOut);
router.post("/users/logout-all", ensureAuthenticated, userController.logOutAll);
router.post("/users/profile", ensureAuthenticated, userController.deleteUser);
router.get("/users/profile", ensureAuthenticated, userController.showSelf);
router.get("/users/:id", ensureAuthenticated, userController.show);

export { router };
