import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { validateEmail } from "./middleware/validateEmail";

const router = Router();

const userController = new UserController();
router.post("/users", validateEmail, userController.create);
router.get("/users/:id", userController.show);

export { router };
