import { Router } from "express";
import usersRoutes from "./users.routes.js";
import notesRoutes from "./notes.routes.js";
import tagsRoutes from "./tags.routes.js";
import sessionRoutes from "./session.routes.js";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/session", sessionRoutes);
routes.use("/notes", notesRoutes);
routes.use("/tags", tagsRoutes);

export default routes;
