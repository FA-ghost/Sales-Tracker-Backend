import express  from 'express';
import path from 'path';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import env from 'dotenv'

const app = express();
const PORT = 3000

env.config()
app.use(cors(corsOptions))

app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.listen(PORT, () =>{
    console.log("App running on port:" + PORT)
})