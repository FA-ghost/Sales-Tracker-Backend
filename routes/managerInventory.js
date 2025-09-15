import { Router } from "express";
import managerInventory from "../controllers/managerInventoryController.js";

const route = Router()

route.get("/topCategory", managerInventory.topCategories)
route.get("/allCategory", managerInventory.allCategories)
route.get("/searchCategory", managerInventory.searchForCategory)
route.post("/newCategory", managerInventory.newCategory)
route.patch("/updateCategory/:id", managerInventory.updateCategory)
route.delete("/deleteCategory/:id", managerInventory.deleteCategory)


export default route