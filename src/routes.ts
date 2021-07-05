import { Router } from "express";
import { UserController } from "./useCases/User/UserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";
import { validatePassword } from "./middleware/validatePassword";
import { verifyPassword } from "./middleware/verifyPassword";

const router = Router();

const userController = new UserController();
router.post("/signup", validatePassword, userController.create);

router.post(
  "/users/profile",
  ensureAuthenticated,
  verifyPassword,
  userController.deleteUser
);

router.get("/users/profile", ensureAuthenticated, userController.showSelf);
router.get("/users/:id", ensureAuthenticated, userController.show);

export { router };
