import { selectCategories, selectCategoriesById, selectCategoriesByName } from "../models/inventory.js"
import { addNewProduct, allProduct, deleteProduct, findProductByCategory, productLastMonthRevenueAndSales, updateProduct, searchProduct } from "../models/products.js"

import { randomUUID } from "crypto"
import { selectSupplierByEmail } from "../models/supplier.js"

const date = new Date()
let lastMonth = date.getMonth() - 0

const managerInventoryProduct = {
    topProducts: async (req, res) => {
        const id = req.params.categoryId
        try{
            const {products} = await findProductByCategory(id)
            const productData = []
            for (let product of products){
                const  { revenue, sale }   = await productLastMonthRevenueAndSales(product.id, lastMonth, date.getFullYear())
                productData.push({
                    categoryId: id,
                    productId: product.id,
                    productName: product.productname,
                    productTotalSalesLastMonth: +sale,
                    productTotalRevenueLastMonth: Number(revenue).toFixed(2)
                })
            }
            const topProductData = productData.sort((old, newRev) => newRev.productTotalRevenueLastMonth - old.productTotalRevenueLastMonth).splice(0, 5)
            res.status(200).json(topProductData)
        } catch (error){
            res.status(404).json({error: error.message})
        }
    },

    allProduct: async (req, res) => {
        const id = req.params.categoryId
        try{
            const {products} = await findProductByCategory(id)
            const productData = []
            for (let product of products){
                const  { revenue, sale }   = await productLastMonthRevenueAndSales(product.id, lastMonth, date.getFullYear())
                productData.push({
                    categoryId: id,
                    productId: product.id,
                    productName: product.productname,
                    productTotalSalesLastMonth: +sale,
                    productTotalRevenueLastMonth: Number(revenue).toFixed(2)
                })
            }
            res.status(200).json(productData)
        } catch (error){
            res.status(404).json({error: error.message})
        }
    },
    newProduct: async (req, res) =>{
        try{
            const categoryId = req.params.categoryId
            const id = randomUUID()
            const newMonthlySalesId = randomUUID()
            const { products } = await allProduct() 
            const { categories } = await selectCategoriesById(categoryId)
            let { productName, supplierEmail, reorderPoint, stockAmount, cost } = req.body
            const { supplierId } = await selectSupplierByEmail(supplierEmail)

            if (products.find(product => product.productname === productName)){
                return res.status(409).json({message: "Duplicate Entry Not Allowed"})
            } else if (!categories || categories.length === 0){
                return res.status(404).json({message: "Category doesn't Exist"})
            } else if (!supplierId || supplierId.length === 0){
                return res.status(404).json({message: "Supplier doesn't Exist"})
            }

            const originalStock = stockAmount
            await addNewProduct(id, productName, categoryId, supplierId[0].id, reorderPoint, stockAmount, originalStock, cost, newMonthlySalesId, date.getMonth(), date.getFullYear())

            res.status(201).json({message: "Successful"})
        }  catch(error){
            res.status(404).json({error: error.message})
        }
    },
    updateProductData: async (req, res) =>{
        try{
            const productId = req.params.productId
            let { productName, categoryName, supplierEmail, reorderPoint, stockAmount, cost } = req.body
            const { categoryNames } = await selectCategoriesByName(categoryName) 
            const { products } = await allProduct()
            const { supplierId } = await selectSupplierByEmail(supplierEmail)


            if (!categoryNames || categoryNames.length === 0){
                return res.status(404).json({message: "Category does not exist"});
            } else if (products.find(product => product.productname === productName)){
                return res.status(409).json({message: "Duplicate Entry Not Allowed"})
            } else if (!supplierId || supplierId.length === 0){
                return res.status(404).json({message: "Supplier doesn't Exist"})
            }

            const product = products.find((product) => product.id === productId)
            const originalStock = product.stockamount + stockAmount

            await updateProduct(productName, productId, supplierId[0].id, categoryNames[0].id, reorderPoint, stockAmount, originalStock, cost)

            res.status(200).json({message: "successful"});

        } catch (error){
            res.status(404).json({error: error.message})
        }
    },
    deleteProduct: async (req, res) =>{
        //update
        try{
            const productId = req.params.productId
            const { products } = await allProduct() 
            if (!products.find(product => product.id === productId)){
                return res.status(404).json({message: "Product does not exist"});
            }
            console.log("hello")
            await deleteProduct(productId)
            res.status(200).json({message: "successful"});

        } catch (error){
            res.status(404).json({error: error.message})
        }
    },

    searchForProduct: async (req, res) =>{
        try{
            let search = req.query.search
            const categoryId = req.params.categoryId

            const { products } = await searchProduct(search, categoryId)
            if (products.length === 0){
                res.status(404).json({message: "Category does not exist"})
            }

            const productData = []
            for (let product of products){
                const  { revenue, sale }   = await productLastMonthRevenueAndSales(product.id, lastMonth, date.getFullYear())
                productData.push({
                    categoryId: categoryId,
                    productId: product.id,
                    productName: product.productname,
                    productTotalSalesLastMonth: +sale,
                    productTotalRevenueLastMonth: Number(revenue).toFixed(2)
                })
            }

            
            res.status(200).json(productData)
        } catch (error){
            res.status(404).json({error: error.message})
        }
    }
}

export default managerInventoryProduct;