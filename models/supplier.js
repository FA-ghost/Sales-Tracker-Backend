import db from "../db/db.js";

const selectSupplierByEmail = async (email) =>{
    try{
        const supplier = await db.query("select id from suppliers where email = $1", [email]);
        return {
            supplierId: supplier.rows
        }
    } catch (error){
        return error.message;
    }
}

export { selectSupplierByEmail }