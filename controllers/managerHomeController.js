import { currentRevenue, currentSale, runningLow } from "../models/monthlyRevenue.js"

const date = new Date

const managerHome = {
    recentUpdates: async (req, res) =>{
        const currMonth = date.getMonth()
        const currYear = date.getFullYear()
        const prevMonth = currMonth - 1
        try{
            const {currRevenue, prevRevenue} = await currentRevenue(currMonth, currYear, prevMonth)
            const {currSale, prevSale} = await currentSale(currMonth, currYear, prevMonth)
            const { lowStockcount } = await runningLow()
        
            res.json({
                currRev: Number(currRevenue.reduce((sum, currRev) => sum + Number(currRev.revenue), 0).toFixed(2)),
                prevRev: Number(prevRevenue.reduce((sum, currRev) => sum + Number(currRev.revenue), 0).toFixed(2)),
                currSal: Number(currSale.reduce((sum, currSal) => sum + Number(currSal.monthlysales), 0).toFixed(2)),
                prevSal: Number(prevSale.reduce((sum, prevSal) => sum + Number(prevSal.monthlysales), 0).toFixed(2)),
                lowStockAmount: lowStockcount,
            });
        } catch (error){
            console.log(error.message)
            res.status(404).json({
                error: error.message
            })
        }
    }
}

export default managerHome;
