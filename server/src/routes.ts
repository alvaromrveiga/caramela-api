import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { validateEmail } from "./middleware/validateEmail";
import { validatePassword } from "./middleware/validatePassword";

const router = Router();

const userController = new UserController();
router.post("/users", validateEmail, validatePassword, userController.create);
router.get("/users/:id", userController.show);

export { router };
