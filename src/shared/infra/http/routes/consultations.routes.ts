import { Router } from "express";

import { CreateConsultationController } from "../../../../modules/consultations/useCases/createConsultation/CreateConsultationController";
import { ShowAllConsultationsController } from "../../../../modules/consultations/useCases/showAllConsultations/ShowAllConsultationsController";
import { ShowConsultationController } from "../../../../modules/consultations/useCases/showConsultation/ShowConsultationController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const consultationsRoutes = Router();

consultationsRoutes.post(
  "/consultations",
  ensureAuthenticated,
  new CreateConsultationController().handle
);

consultationsRoutes.get(
  "/consultations/:id",
  ensureAuthenticated,
  new ShowConsultationController().handle
);

consultationsRoutes.get(
  "/pets/:id/consultations",
  ensureAuthenticated,
  new ShowAllConsultationsController().handle
);

export { consultationsRoutes };
