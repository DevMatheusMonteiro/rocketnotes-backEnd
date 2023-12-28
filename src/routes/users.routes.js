import { Router } from "express";
import UsersController from "../controllers/UsersController.js";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import multer from "multer";
import * as uploadConfig from "../configs/upload.js";

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  (req, res) => {
    console.log(req.file.filename);

    res.json();
  }
);

export default usersRoutes;
