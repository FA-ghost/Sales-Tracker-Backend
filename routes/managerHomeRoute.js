import { Router } from "express";
import managerHome from "../controllers/managerHomeController.js";

const route = Router();

route.get("/recentUpdates", managerHome.recentUpdates)
route.get("/revenueOverTime", managerHome.revenueOverTime)
route.get("/revenueGrowth", managerHome.growthTrend)
route.get("/revenueGrowthByYear", managerHome.revenueGrowthByYear)

export  default route