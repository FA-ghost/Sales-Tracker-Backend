import db from "../db/db.js";

const allProduct = async () =>{
    try{
        const product = await db.query("select * from products");
        return {
            products: product.rows,
        }

    } catch (error){
        return error.message;
    }
}


const findProductByCategory = async (categoryId) =>{
    try{
        const products = await db.query("select id, productName, reorderPoint, stockAmount, originalStock, cost from products where categoryId = $1", [categoryId]);
        return {
            products: products.rows,
        }

    } catch (error){
        return error.message
    }
}

const productLastMonthRevenueAndSales = async (productId, lastMonth, year) =>{
    try{
        const data = await db.query("select monthlysales, revenue  from monthlySales where productId = $1 and month = $2 and year = $3", [productId, lastMonth, year]);
        return {
            revenue: data.rows.map((rev) => rev.revenue),
            sale: data.rows.map((sale) =>  sale.monthlysales)
        }
    } catch (error){
        return error.message;
    }
}

const addNewProduct = async (productId, productName, categoryId, supplierId, reorderPoint, stockAmount, originalStock, cost, newMonthlySalesId, month, year) =>{
    try{
        await db.query("Insert into products (id, productName, categoryId, supplierId, reorderPoint, stockAmount, originalStock, cost) values ($1, $2, $3, $4, $5, $6, $7, $8)", [productId, productName, categoryId, supplierId, reorderPoint, stockAmount, originalStock, cost])
        await db.query("Insert into monthlySales (id, productId, month, year) values ($1, $2, $3, $4)", [newMonthlySalesId, productId, month, year])
    } catch (error){
        return error.message
    }
}

const updateProduct = async (newProductName, productId, supplierId, categoryId, reorderPoint, stockAmount, originalStock, cost) =>{
    try{
        await db.query("update products set productName = $1, supplierId = $2, categoryId = $3, reorderPoint = $4, stockAmount = $5, originalStock = $6, cost = $7 where id = $8", [newProductName, supplierId, categoryId, reorderPoint, stockAmount, originalStock, cost, productId])
    } catch (error){
        return error.message
    }
}

const updateProductCategoryId = async (newCategoryId, prevCategoryId) =>{
    try{
        await db.query("update products set categoryId = $1 where categoryId = $2", [newCategoryId, prevCategoryId])
    } catch (error){
        return error.message
    }
}

const deleteProduct = async (productId) =>{
    try{
        await db.query("delete from products where id = $1", [productId])
    } catch (error){
        return error.message
    }
}

const searchProduct = async (search, categoryId) =>{
    try{
        const products = await db.query("select * from products where productName ILIKE '%' || $1 || '%' and categoryId = $2", [search, categoryId]);
        return {
            products: products.rows
        }
    } catch (error){
        return error.message;
    }
}

export { allProduct, findProductByCategory, productLastMonthRevenueAndSales, addNewProduct, updateProduct, updateProductCategoryId, deleteProduct, searchProduct }