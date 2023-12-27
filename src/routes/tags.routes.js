import { Router } from "express";
import TagsController from "../controllers/TagsController.js";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";

const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.use(ensureAuthenticated);

tagsRoutes.get("/", tagsController.index);

export default tagsRoutes;
