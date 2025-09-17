import { Router } from "express";
import managerInventoryProduct from "../controllers/managerInventoryProductController.js";

const route = Router()

route.get("/topProduct/:categoryId", managerInventoryProduct.topProducts)
route.get("/allProduct/:categoryId", managerInventoryProduct.allProduct)
route.get("/searchProduct/:categoryId", managerInventoryProduct.searchForProduct)
route.post("/newProduct/:categoryId", managerInventoryProduct.newProduct)
route.patch("/updateProduct/:productId", managerInventoryProduct.updateProductData)
route.delete("/deleteProduct/:productId", managerInventoryProduct.deleteProduct)


export default route