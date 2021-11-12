import { Router } from "express";

import { RouteNotFoundError } from "../../../errors/RouteNotFoundError";
import { authenticationRoutes } from "./authentication.routes";
import { consultationsRoutes } from "./consultations.routes";
import { petsRoutes } from "./pets.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

router.use(authenticationRoutes);
router.use(consultationsRoutes);
router.use(petsRoutes);
router.use(usersRoutes);

router.all("*", () => {
  throw new RouteNotFoundError();
});

export { router };
