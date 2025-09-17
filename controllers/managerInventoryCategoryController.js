import { addNewCategory, categoryLastMonthRevenueAndSales, categoryProducts, selectCategories, updateCategories, deleteCategories, searchCategories, selectCategoriesById, selectCategoriesByName } from "../models/inventory.js"
import { randomUUID } from "crypto"
import { updateProductCategoryId } from "../models/products.js"

const date = new Date()
let lastMonth = date.getMonth() - 0

const managerInventoryCategory = {
    topCategories: async (req, res) => {
        try{
            const {categories} = await selectCategories()
            const categoryData = []
            for (let category of categories){
                const { data }  = await categoryProducts(category.id, lastMonth, date.getFullYear())
                const  { revenue, sale }   = await categoryLastMonthRevenueAndSales(category.id, lastMonth, date.getFullYear())
                categoryData.push({
                    categoryId: category.id,
                    categoryName: category.categoryname,
                    productCount: data[0].count,
                    categoryTotalSalesLastMonth: sale.reduce((sum, sale) => sum + sale, 0),
                    categoryTotalRevenueLastMonth: +((revenue.reduce((sum, rev) => sum + +(rev), 0)).toFixed(2))
                })
            }
            const topCategoriesData = categoryData.sort((old, newRev) => newRev.categoryTotalRevenueLastMonth - old.categoryTotalRevenueLastMonth).splice(0, 5)
            res.status(200).json(topCategoriesData)
        } catch (error){
            res.status(404).json({error: error.message})
        }
    },

    allCategories: async (req, res) => {
        try{
            const {categories} = await selectCategories()
            const categoryData = []
            for (let category of categories){
                const { data }  = await categoryProducts(category.id, lastMonth, date.getFullYear())
                const  { revenue, sale }   = await categoryLastMonthRevenueAndSales(category.id, lastMonth, date.getFullYear())
                categoryData.push({
                    categoryId: category.id,
                    categoryName: category.categoryname,
                    productCount: data[0].count,
                    categoryTotalSalesLastMonth: sale.reduce((sum, sale) => sum + sale, 0),
                    categoryTotalRevenueLastMonth: +((revenue.reduce((sum, rev) => sum + +(rev), 0)).toFixed(2))
                })
            }
            res.status(200).json(categoryData)
        } catch (error){
            res.status(404).json({error: error.message})
        }
    },
    newCategory: async (req, res) =>{
        try{
            const id = randomUUID()
            const { categories } = await selectCategories() 
            let { categoryName } = req.body
            if (categories.find(category => category.categoryname === categoryName)){
                return res.status(409).json({message: "Duplicate Entry"})
            } 
            await addNewCategory(id, categoryName)

            res.status(201).json({message: "Successful"})
        }  catch(error){
            res.status(404).json({error: error.message})
        }
    },
    updateCategory: async (req, res) =>{
        try{
            let categoryId = req.params.id
            let { categoryName } = req.body
            const { categories } = await selectCategories()
            if (categories.find(category => category.categoryname === categoryName)){
                return res.status(409).json({message: `Cannot delete '${categoryName}' due to it being for edgecase`});
            }else if (!categories.find(category => category.id === categoryId)){
                return res.status(404).json({message: "Category does not exist"});
            } else if (categories.find(category => category.categoryname === categoryName)){
                return res.status(409).json({message: "Duplicate Entry"})
            }

            await updateCategories(categoryName, categoryId)
            res.status(200).json({message: "successful"});

        } catch (error){
            res.status(404).json({error: error.message})
        }
    },
    deleteCategory: async (req, res) =>{
        try{
            let categoryId = req.params.id
            const categoryName = "No Category"
            const { categories } = await selectCategories()

            const categoryToDelete = categories.find(category => category.id === categoryId);
            
            if (!categoryToDelete) {
                return res.status(404).json({message: "Category does not exist"});
            }

            if (categoryToDelete.categoryname === categoryName) {
                return res.status(409).json({message: `Cannot delete '${categoryName}' due to it being for edgecase`});
            }

            //get no categoryID
            const { categoryNames } = await selectCategoriesByName(categoryName)
            await updateProductCategoryId(categoryNames[0].id, categoryId)

            await deleteCategories(categoryId)
            res.status(200).json({message: "successful"});

        } catch (error){
            res.status(404).json({error: error.message})
        }
    },

    searchForCategory: async (req, res) =>{
        try{
            console.log(req.query.search)
            let search = req.query.search

            const { categories } = await searchCategories(search)
            if (categories.length === 0){
                res.status(404).json({message: "Category does not exist"})
            }

            const categoryData = []
            for (let category of categories){
                const { data }  = await categoryProducts(category.id, lastMonth, date.getFullYear())
                const  { revenue, sale }   = await categoryLastMonthRevenueAndSales(category.id, lastMonth, date.getFullYear())
                categoryData.push({
                    categoryId: category.id,
                    categoryName: category.categoryname,
                    productCount: data[0].count,
                    categoryTotalSalesLastMonth: sale.reduce((sum, sale) => sum + sale, 0),
                    categoryTotalRevenueLastMonth: +((revenue.reduce((sum, rev) => sum + +(rev), 0)).toFixed(2))
                })
            }
            res.status(200).json(categoryData)
        } catch (error){
            res.status(404).json({error: error.message})
        }
    }
}

export default managerInventoryCategory;