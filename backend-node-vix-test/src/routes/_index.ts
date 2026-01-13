import { Router } from "express";
import { brandMasterRoutes } from "./brandMaster.routes";
import { vMRoutes } from "./vM.routes";
import { uploadsRoutes } from "./uploads.routes";
import { userRoutes } from "./user.routes";
import { API_VERSION } from "../constants/basePathRoutes";

export const routes = Router();

routes.get(API_VERSION.V1, (_req, res) => {
  res.status(200).json({ message: "API v1" });
});

routes.use(userRoutes);
routes.use(uploadsRoutes);
routes.use(brandMasterRoutes);
routes.use(vMRoutes);
