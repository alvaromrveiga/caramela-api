import "reflect-metadata";
import express from "express";
import "express-async-errors";
import createConnection from "./connection";
import { router } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

createConnection();

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

export { app };
