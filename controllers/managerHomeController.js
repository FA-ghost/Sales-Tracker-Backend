import { currentRevenue, currentSale, runningLow, revenueTrend, yearlyRevenue } from "../models/Revenue.js"
import { allProduct } from "../models/products.js";

const date = new Date()
let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const getLast6Months = () =>{

    let lastSixMonth = [];

    for(let i = 6; i > 0; i -= 1) {
        let d = new Date(date.getFullYear(), date.getMonth() - i, 1);

        let year = d.getFullYear()  
        let monthNumber = d.getMonth()
        let month = monthNames[d.getMonth()];
        lastSixMonth.push({
            monthNum: monthNumber, 
            currMonth: month,
            currYear: year
        })

    }

    return lastSixMonth
}

const managerHome = {
    recentUpdates: async (req, res) =>{
        const currMonth = date.getMonth()
        const currYear = date.getFullYear()
        const prevMonth = currMonth - 1
        try{
            const {currRevenue, prevRevenue} = await currentRevenue(currMonth, currYear, prevMonth)
            const {currSale, prevSale} = await currentSale(currMonth, currYear, prevMonth)
            const { lowStockcount } = await runningLow()
            const { products } = await allProduct()

            let reducedCurrentRevenue = +currRevenue.reduce((sum, currRev) => sum + +currRev.revenue, 0).toFixed(2);
            let reducedPrevRevenue = +prevRevenue.reduce((sum, currRev) => sum + +currRev.revenue, 0).toFixed(2);
            let reducedCurrSale = +currSale.reduce((sum, currSal) => sum + +currSal.monthlysales, 0).toFixed(2);
            let reducePrevSale = +prevSale.reduce((sum, prevSal) => sum + +prevSal.monthlysales, 0).toFixed(2)
        
            res.status(200).json({
                currRev: reducedCurrentRevenue,
                growthAgainstLastRev: +(((reducedCurrentRevenue - reducedPrevRevenue)/reducedPrevRevenue)*100).toFixed(2),
                currSal: reducedCurrSale,
                growthAgainstLastSal: +(((reducedCurrSale - reducePrevSale)/reducePrevSale)*100).toFixed(2),
                lowStockAmount: lowStockcount,
                productCount: products.length,
            });
        } catch (error){
            console.log(error.message)
            res.status(404).json({
                error: error.message
            })
        }
    },

    revenueOverTime: async (req, res) =>{
        const last6Months = getLast6Months();
        try{
            let data = []
            let prevGrowth = async () =>{
                for (let i = 0; i < last6Months.length; i++) {
                    let {month, revenue, monthlySales} = await revenueTrend(last6Months[i].monthNum, last6Months[i].currYear)
                    data.push({
                        month: monthNames[month],
                        revenue: +revenue.reduce((sum, currRev) => (sum + currRev), 0).toFixed(2),
                        sales: +monthlySales.reduce((sum, currSal) => (sum + currSal), 0).toFixed(2)
                    })
                };
            }
            await prevGrowth()
            let dataToReturn = {
                label: data.map((currMonth) => currMonth.month),
                sales: {
                    label: 'Sales',
                    data: data.map((sal) => sal.sales),
                },
                revenue: {
                    label: 'Revenue',
                    data: data.map((rev) => rev.revenue),
                }
            }
            //above code when connecting to the frontend
            res.status(200).json(dataToReturn)
        } catch (error){
            res.status(404).json({
                error: error.message
            })
        }
    },

    growthTrend: async (req, res) =>{
        const last6Months = getLast6Months();
        try{
            let data = []
            
            for (let i = 0; i < last6Months.length; i++){
                const currMonth = last6Months[i].monthNum;
                const currYear = last6Months[i].currYear;
                
                // Calculate previous month (this handles year boundaries automatically)
                const prevDate = new Date(currYear, currMonth - 1);
                const prevMonth = prevDate.getMonth();
                const prevYear = prevDate.getFullYear();

                // Fix destructuring to match your function's return values
                const { currRevenue, prevRevenue } = await currentRevenue(
                    currMonth,
                    currYear,
                    prevMonth,
                );
                const { currSale, prevSale } = await currentSale(
                    currMonth,
                    currYear,
                    prevMonth,
                );
                let reducedCurrRev = +currRevenue.reduce((sum, rev)=> sum + +rev.revenue, 0);
                let reducedPrevRev = +prevRevenue.reduce((sum, prevRev)=> sum + +prevRev.revenue, 0);
                let reducedCurrSal = +currSale.reduce((sum, sal)=> sum + +sal.monthlysales, 0)
                let reducedPrevSal = +prevSale.reduce((sum, prevSal)=> sum + +prevSal.monthlysales, 0)
                data.push({
                    curryear: currYear,
                    prevYear: prevYear,
                    currMonth: monthNames[currMonth],
                    prevMonth: monthNames[prevMonth],
                    growthRevenuePercent: +(((reducedCurrRev - reducedPrevRev )/reducedPrevRev)*100).toFixed(2),
                    growthSalesPercent: +(((reducedCurrSal - reducedPrevSal)/reducedPrevSal)*100).toFixed(2)
                })
                
            }
            const dataToReturn = {
                label: data.map(mon => mon.currMonth),
                sales: {
                    label: 'Sales',
                    data: data.map(sale => sale.growthSalesPercent)
                },
                revenue:{
                    label: 'Revenue',
                    data: data.map(rev => rev.growthRevenuePercent)
                }
            }
            //above code when connecting to the frontend
            res.status(200).json(dataToReturn)

        } catch (error){
            res.status(404).json({
                error: error.message
            })
        }
    },

    revenueGrowthByYear: async (req, res) =>{
        try{
            const thisYear = date.getFullYear()
            let last3Years = Array.from({length: 3}, (_, i) => thisYear - (i))
            let data = [];
            for (const year of  last3Years){
                const {currYear, revenue, sales } = await yearlyRevenue(year)
                data.push({
                    currYr: currYear,
                    totalRevenue: +revenue.reduce((sum, rev) => sum + +rev, 0).toFixed(2),
                    totalSale: +sales.reduce((sum, sal) => sum + +sal, 0),
                })
            }
            const dataToReturn = {
                label: data.map(yr => yr.currYr),
                sales: {
                    label: 'Sales',
                    data: data.map(sale => sale.totalSale)
                },
                revenue:{
                    label: 'Revenue',
                    data: data.map(rev => rev.totalRevenue)
                }
            }
            // above code when connecting to the frontend
            res.status(200).json(dataToReturn)
        } catch (error){
            res.status(404).json({
                error: error.message
            })
        }
    }
}

export default managerHome;
