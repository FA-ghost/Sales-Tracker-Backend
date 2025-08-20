import { Router } from "express";
import managerHome from "../controllers/managerHomeController.js";

const route = Router();

route.get("/recentUpdates", managerHome.recentUpdates)

export  default route