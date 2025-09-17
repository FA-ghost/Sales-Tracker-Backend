import { Router } from "express";
import managerInventoryCategory from "../controllers/managerInventoryCategoryController.js";

const route = Router()

route.get("/topCategory", managerInventoryCategory.topCategories)
route.get("/allCategory", managerInventoryCategory.allCategories)
route.get("/searchCategory", managerInventoryCategory.searchForCategory)
route.post("/newCategory", managerInventoryCategory.newCategory)
route.patch("/updateCategory/:id", managerInventoryCategory.updateCategory)
route.delete("/deleteCategory/:id", managerInventoryCategory.deleteCategory)


export default route