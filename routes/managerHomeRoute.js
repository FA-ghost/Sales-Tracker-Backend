import { Router } from "express";
import managerHome from "../controllers/managerHomeController.js";

const route = Router();

route.get("/recentUpdates", managerHome.recentUpdates)
route.get("/revenueTrend", managerHome.revenueTrend)
route.get("/revenueGrowth", managerHome.growthTrend)

export  default route