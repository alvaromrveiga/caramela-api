import { Router } from "express";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";
import { UserController } from "./useCases/User/UserController";
import { PetController } from "./useCases/Pet/PetController";

const router = Router();
const userController = new UserController();
const petController = new PetController();

router.post("/signup", userController.create);
router.post("/login", userController.logIn);
router.post("/users/logout", ensureAuthenticated, userController.logOut);
router.post("/users/logout-all", ensureAuthenticated, userController.logOutAll);
router.get("/users/profile", ensureAuthenticated, userController.showSelf);
router.get("/users/:id", ensureAuthenticated, userController.show);
router.put("/users/profile", ensureAuthenticated, userController.update);
router.delete("/users/profile", ensureAuthenticated, userController.deleteUser);

router.post("/users/pets", ensureAuthenticated, petController.create);

export { router };
