import { Router } from "express";

import { petsRoutes } from "./pets.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use(usersRoutes);
router.use(petsRoutes);

export { router };
