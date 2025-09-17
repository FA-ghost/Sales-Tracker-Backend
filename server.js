import express  from 'express';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import env from 'dotenv'
import morgan from 'morgan';
import managerHomeRoute from "./routes/managerHomeRoute.js";
import managerInventoryCategoryRoute from "./routes/managerInventoryCategoryRoute.js"
import managerInventoryProductRoute from "./routes/managerInventoryProductRoute.js"


const app = express();
const PORT = 3000

env.config()
app.use(cors(corsOptions))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(morgan("dev"));

app.use("/api/v1/managerHome", managerHomeRoute)
app.use("/api/v1/managerInventoryCategory", managerInventoryCategoryRoute)
app.use("/api/v1/managerInventoryProduct", managerInventoryProductRoute)

app.listen(PORT, () =>{
    console.log("App running on port:" + PORT)
})