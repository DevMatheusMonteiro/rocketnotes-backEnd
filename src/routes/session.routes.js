import { Router } from "express";

import SessionsController from "../controllers/SessionController.js";

const sessionController = new SessionsController();

const sessionRoutes = Router();

sessionRoutes.post("/", sessionController.create);

export default sessionRoutes;
