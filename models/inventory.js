import { ok } from "assert";
import db from "../db/db.js";


const selectCategories = async () =>{
    try{
        const categories = await db.query("select * from categories");
        return {
            categories: categories.rows
        }
    } catch (error){
        return error.message;
    }
}

const categoryProducts = async (categoryId) =>{
    try{
        const data = await db.query("select count(productName)  from products where categoryId = $1", [categoryId]);
        return {
            data: data.rows
        }
    } catch (error){
        return error.message;
    }
}

const categoryLastMonthRevenueAndSales = async (categoryId, lastMonth, year) =>{
    try{
        const data = await db.query("select monthlySales.monthlySales, monthlySales.revenue  from monthlySales inner join products on products.id = monthlySales.productId where products.categoryId = $1 and monthlySales.month = $2 and monthlySales.year = $3", [categoryId, lastMonth, year]);
        return {
            revenue: data.rows.map((rev) => rev.revenue),
            sale: data.rows.map((sale) =>  sale.monthlysales)
        }
    } catch (error){
        return error.message;
    }
}

const addNewCategory = async (categoryId, categoryName) =>{
    try{
        await db.query("Insert into categories (id, categoryName) values ($1, $2)", [categoryId, categoryName])
    } catch (error){
        return error.message
    }
}

const updateCategories = async (newCategoryName,categoryId) =>{
    try{
        await db.query("update categories set categoryName = $1 where id = $2", [newCategoryName, categoryId])
    } catch (error){
        return error.message
    }
}

const deleteCategories = async (categoryId) =>{
    try{
        await db.query("delete from categories where id = $1", [categoryId])
    } catch (error){
        return error.message
    }
}

const searchCategories = async (search) =>{
    try{
        const categories = await db.query("select * from categories where categoryName ILIKE '%' || $1 || '%'", [search]);
        return {
            categories: categories.rows
        }
    } catch (error){
        return error.message;
    }
}


export { selectCategories, categoryProducts, categoryLastMonthRevenueAndSales, addNewCategory, updateCategories, deleteCategories, searchCategories }