import { randomUUID } from "crypto";
import db from "../db/db.js";
import data from '../product_sales_yearly_with_names_full.json' with {type: "json"};


const newProduct = data;
console.log(data.length)
const insertProduct = async () =>{
    try{
        for(const product of newProduct){
            const id = randomUUID()
            // const exist = await db.query("SELECT productId FROM products WHERE productId = $1 and month = $2", [product.productName, product.Month]);
            // if (exist.rows.length > 0){
            //     console.log(`Skipping ${product["Product Name"]}...`)
            //     continue
            // }
            const productId = await db.query("SELECT id FROM products WHERE productName = $1", [product["Product Name"]]);
            await db.query("INSERT INTO yearlySales (id, productId, year, yearlySales, revenue) VALUES ($1, $2, $3, $4, $5)",  [id, productId.rows[0].id, product.Year, product["Yearly Sales"], product["Yearly Revenue"]])
            console.log(`Inserted ${product["Product Name"]} successfully`)
            
        }
        db.end()
        .then(console.log("Database disconnected successfully"))
        .catch(console.log(error.message));
    } catch (error) {
        console.log(error.message)
    }

}

insertProduct();