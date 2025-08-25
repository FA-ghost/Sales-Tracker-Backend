import db from "../db/db.js";

const allProduct = async () =>{
    try{
        const product = await db.query("select productName from products");
        return {
            products: product.rows,
        }

    } catch (error){
        return error.message;
    }
}

export {allProduct}