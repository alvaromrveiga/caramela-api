import { Router } from "express";

import { appointmentsRoutes } from "./appointments.routes";
import { petsRoutes } from "./pets.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use(appointmentsRoutes);
router.use(petsRoutes);
router.use(usersRoutes);

export { router };
