import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";
import { validateEmail } from "./middleware/validateEmail";
import { validatePassword } from "./middleware/validatePassword";
import { verifyPassword } from "./middleware/verifyPassword";

const router = Router();

const userController = new UserController();
router.post("/signup", validateEmail, validatePassword, userController.create);

router.post(
  "/users/profile",
  ensureAuthenticated,
  verifyPassword,
  userController.deleteUser
);

router.get("/users/profile", ensureAuthenticated, userController.showSelf);
router.get("/users/:id", ensureAuthenticated, userController.show);

export { router };
