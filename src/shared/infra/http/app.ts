import "reflect-metadata";
import "../../container";
import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerFile from "../../../swagger.json";
import "express-async-errors";
import createConnection from "../typeorm/connection";
import { errorHandler } from "./middleware/errorHandler";
import { router } from "./routes";

createConnection();

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);
app.use(errorHandler);

export { app };
