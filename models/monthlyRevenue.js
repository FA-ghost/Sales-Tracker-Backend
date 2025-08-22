import db from "../db/db.js"


const currentRevenue = async (currMonth, currentYear,prevMonth) =>{
    try{
        const currMonRevenue = await db.query("select revenue from monthlySales where month = $1 and year = $2", [currMonth, currentYear]);
        const prevMonRevenue = await db.query("select revenue from monthlySales where month = $1 and year = $2", [prevMonth, currentYear]);
        return {
            currRevenue: currMonRevenue.rows,
            prevRevenue: prevMonRevenue.rows,
        }
    } catch (error){
        return error.message;
    }
}

const currentSale = async (currMonth, currentYear, prevMonth) =>{
    try{
        const currMonSale = await db.query("select monthlySales from monthlySales where month = $1 and year = $2", [currMonth, currentYear]);
        const prevMonSale = await db.query("select monthlySales from monthlySales where month = $1 and year = $2", [prevMonth, currentYear]);
        return {
            currSale: currMonSale.rows,
            prevSale: prevMonSale.rows,
        }
    } catch (error){
        return error.message;
    }
}

const runningLow = async () =>{
    try{
        const lowStockAmount = await db.query("select stockamount from products where stockamount <= reorderpoint");
        return {
            lowStockcount: lowStockAmount.rows.length
        }
    } catch (error) {
        return error.message
    }
}

const revenueTrend = async (month, year) =>{
    try{
        const revenue = await db.query("select revenue, monthlySales from monthlySales where month = $1 and year = $2", [month, year])
        return {
                month: month,
                rev: revenue.rows.map(rev => +rev.revenue ),
                monthlySal: revenue.rows.map(sale => +sale.monthlysales),
            }

    } catch (error){
        return error.message
    }
}


export {currentRevenue, currentSale, runningLow, revenueTrend};