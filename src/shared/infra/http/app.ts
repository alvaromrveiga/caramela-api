import "reflect-metadata";
import express from "express";

import "express-async-errors";
import createConnection from "../typeorm/connection";
import { errorHandler } from "./middleware/errorHandler";
import { router } from "./routes";

createConnection();

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

export { app };
