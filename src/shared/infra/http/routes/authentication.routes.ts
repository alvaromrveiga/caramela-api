import { Router } from "express";

import { ForgotPasswordEmailController } from "../../../../modules/users/useCases/forgotPasswordEmail/ForgotPasswordEmailController";
import { LoginUserController } from "../../../../modules/users/useCases/loginUser/LoginUserController";
import { LogoutAllUserController } from "../../../../modules/users/useCases/logoutAllUser/LogoutAllUserController";
import { LogoutUserController } from "../../../../modules/users/useCases/logoutUser/LogoutUserController";
import { RefreshTokenController } from "../../../../modules/users/useCases/refreshToken/RefreshTokenController";
import { ResetPasswordController } from "../../../../modules/users/useCases/resetPassword/ResetPasswordController";
import { ShowTokensController } from "../../../../modules/users/useCases/showTokens/ShowTokensController";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated";

const authenticationRoutes = Router();

authenticationRoutes.post("/login", new LoginUserController().handle);
authenticationRoutes.post(
  "/refresh-token",
  new RefreshTokenController().handle
);
authenticationRoutes.post(
  "/forgot",
  new ForgotPasswordEmailController().handle
);

authenticationRoutes.post(
  "/resetpassword/:id/:token",
  new ResetPasswordController().handle
);

authenticationRoutes.post(
  "/logout",
  ensureAuthenticated,
  new LogoutUserController().handle
);

authenticationRoutes.post(
  "/users/logout-all",
  ensureAuthenticated,
  new LogoutAllUserController().handle
);

authenticationRoutes.get(
  "/users/sessions",
  ensureAuthenticated,
  new ShowTokensController().handle
);

export { authenticationRoutes };
