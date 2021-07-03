import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authenticate } from "./middleware/authentication";
import { validateEmail } from "./middleware/validateEmail";
import { validatePassword } from "./middleware/validatePassword";
import { verifyPassword } from "./middleware/verifyPassword";

const router = Router();

const userController = new UserController();
router.post("/signup", validateEmail, validatePassword, userController.create);

router.post(
  "/users/profile",
  authenticate,
  verifyPassword,
  userController.deleteUser
);

router.get("/users/profile", authenticate, userController.showSelf);
router.get("/users/:id", authenticate, userController.show);

export { router };
