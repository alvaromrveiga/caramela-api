import { Router } from "express";

import { CreateAppointmentController } from "../../../../modules/appointments/useCases/createAppointment/CreateAppointmentController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const appointmentsRoutes = Router();

appointmentsRoutes.post(
  "/appointments",
  ensureAuthenticated,
  new CreateAppointmentController().handle
);

export { appointmentsRoutes };
