import express, { Application } from "express";
import urlRoutes from "./routes/UrlRoutes";
import cors from "cors";
import {rateLimiter} from "./middlewares/rateLimiter";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(rateLimiter); // Apply rate limiter middleware globally

app.use(urlRoutes);

export default app;
