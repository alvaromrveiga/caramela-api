import "reflect-metadata";
import express from "express";

import "express-async-errors";
import { errorHandler } from "./middleware/errorHandler";
import { router } from "./routes";
import createConnection from "./shared/infra/typeorm/connection";

createConnection();

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

export { app };
