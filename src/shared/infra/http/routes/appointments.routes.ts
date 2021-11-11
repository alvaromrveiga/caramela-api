import { Router } from "express";

import { CreateAppointmentController } from "../../../../modules/appointments/useCases/createAppointment/CreateAppointmentController";
import { ShowAppointmentController } from "../../../../modules/appointments/useCases/showAppointment/ShowAppointmentController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const appointmentsRoutes = Router();

appointmentsRoutes.post(
  "/appointments",
  ensureAuthenticated,
  new CreateAppointmentController().handle
);

appointmentsRoutes.get(
  "/appointments/:id",
  ensureAuthenticated,
  new ShowAppointmentController().handle
);

export { appointmentsRoutes };
