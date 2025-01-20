import express, { Application } from "express";
import urlRoutes from "./routes/urlRoutes";

const app: Application = express();
app.use(express.json());
app.use(urlRoutes);

export default app;
