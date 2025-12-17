import { ApiError } from "../utils/ApiError.utils.js";
import { BusinessFinancial } from "../models/businessFinancial.model.js";
import {clamp, } from "../utils/math.util.js"

export const createBusinessFinancialService = async (
    {userId, 
     periodStart, 
     periodEnd, 
     cash, 
     bankBalance, 
     accountsReceivable, 
     inventory, 
     currentAssetsOther, 
     currentLiabilities, 
     monthlyOperatingExpenses, 
     revenue, 
     grossProfit, 
     netProfit, 
     operatingExpenses, 
     cogs, 
     avgInventory, 
     payables, 
     totalDebt,
     monthlyCashflows, 
     totalEquity, 
     ebitda, 
     interestExpense, 
     scoreLH, 
     scorePH, 
     scoreCS, 
     scoreEH, 
     scoreSH,financialHealthScore }
) => { 
    // const existing = await BusinessFinancial.findOne({ $or: [{ businessName }, { adminEmail }] });
    // if (existing) throw new ApiError(409, "Business name or admin email already exists");
    const businessFinancial = await BusinessFinancial.create({ 
    userId,
     periodStart, 
     periodEnd, 
     cash, 
     bankBalance, 
     accountsReceivable, 
     inventory, 
     currentAssetsOther, 
     currentLiabilities, 
     monthlyOperatingExpenses, 
     revenue, 
     grossProfit, 
     netProfit, 
     operatingExpenses, 
     cogs, 
     avgInventory, 
     payables, 
     totalDebt,
     monthlyCashflows, 
     totalEquity, 
     ebitda, 
     interestExpense, 
     scoreLH, 
     scorePH, 
     scoreCS, 
     scoreEH, 
     scoreSH,
     financialHealthScore
    });
    
    
    // // ============= Financial Health Calculation ===========
    //   // current assets
    // const calculateCurrentAssets = (cash, bankBalance, accountsReceivable, inventory, currentAssetsOther) => {
    //     const currentAssets = cash + bankBalance + accountsReceivable  + inventory + currentAssetsOther;
    //     return currentAssets;
    // };
    // // quick assets
    // const calculateQuickAssets = (cash, bankBalance, accountsReceivable) => {
    //   const quickAssets = cash + bankBalance + accountsReceivable;
    //   return quickAssets;
    // };
    // // current ratio
    // const calculateCurrentRatio = (currentAssets, currentLiabilities) => {
    //   if(currentLiabilities > 0){
    //     const currentAssetsRatio = currentAssets / currentLiabilities;
    //     const currentAssetsRatioScore = Math.min(100, (currentAssetsRatio / 2.0) * 100);
    //     return {currentAssetsRatio, currentAssetsRatioScore};
    //   }else{
    //     console.log("currentLiabilities", currentLiabilities);
    //     return 0;
    //   }
    // };
    // // quick ratio
    // const calculateQuickRatio = (quickAssets, currentLiabilities) => {
    //   if(currentLiabilities > 0){
    //     const quickAssetsRatio = quickAssets / currentLiabilities;
    //     const quickAssetsRatioScore = Math.min(100, (quickAssetsRatio / 1.5) * 100);
    //     return {quickAssetsRatio, quickAssetsRatioScore};
    //   }else{
    //     console.log("currentLiabilities", currentLiabilities);
    //     return 0;
    //   }
    // };
    // // runway month
    // const calculateRunwayMonths = (cash, monthlyOperatingExpenses) => {
    //     if(monthlyOperatingExpenses > 0){
    //       const runwayMonths = cash / monthlyOperatingExpenses;
    //       const runwayMonthsScore = Math.min(100, (runwayMonths / 6.0) * 100);
    //       return {runwayMonths, runwayMonthsScore};
    //     }else{
    //       console.log("monthlyOperatingExpenses", monthlyOperatingExpenses);
    //       return 0;
    //     }
    //   };
    // // liquidity ratio
    // const calculateLiquidityRatio = (currentAssets, currentLiabilities) => {
    //   if(currentLiabilities > 0){
    //     const liquidityRatio = currentAssets / currentLiabilities;
    //     return liquidityRatio;
    //   }else{
    //     console.log("currentLiabilities", currentLiabilities);
    //     return 0;
    //   }
    // };


    // const currentAssets = calculateCurrentAssets(cash, bankBalance, accountsReceivable, inventory, currentAssetsOther);


    // const {currentAssetsRatioScore} = calculateCurrentRatio(currentAssets, currentLiabilities);

    // const {quickAssetsRatioScore} = calculateQuickAssets(cash, bankBalance, accountsReceivable);

    // // const liquidityRatio = calculateLiquidityRatio(currentAssets, currentLiabilities);

    // const {runwayMonthsScore} = calculateRunwayMonths(cash, monthlyOperatingExpenses);
    
    // // 1.Liquidity Health 
    // const liquidityHealth = (currentAssetsRatioScore*0.4) + (quickAssetsRatioScore*0.3) + (runwayMonthsScore*0.3);

    // // 2.Profiablity Health
    // // -------------- intermediate calculations--------------
    // const calculateNetProfitMargin = (netProfit, revenue) => {
    //   if(revenue > 0){
    //     const netProfitMargin = (netProfit / revenue);  
    //     const netProfitMarginScore = clamp(netProfitMargin*1000, 0 , 100);
    //     return {netProfitMargin, netProfitMarginScore};
    //   }else{
    //     console.log("revenue", revenue);
    //     return 0;
    //   }}; 
    // const calculateGrossProfitMargin = (grossProfit, revenue) => {
    //   if(revenue > 0){
    //     const grossProfitMargin = (grossProfit / revenue);  
    //     const grossProfitMarginScore = clamp(grossProfitMargin*200, 0 , 100);
    //     return {grossProfitMargin, grossProfitMarginScore};
    //   }else{
    //     console.log("revenue", revenue);
    //     return 0;
    //   }};

    // const calculateOperatingMargin = (revenue, operatingExpenses) => {
    //   if(revenue > 0){
    //     const operatingMargin = (revenue - operatingExpenses) / revenue;
    //     const operatingMarginScore = clamp(operatingMargin*300, 0 , 100);
    //     return {operatingMargin, operatingMarginScore};
    //   }else{
    //     console.log("revenue", revenue);
    //     return 0;
    //   }
    // };

    // const {netProfitMarginScore} = calculateNetProfitMargin( netProfit, revenue);
    // const {grossProfitMarginScore} = calculateGrossProfitMargin(grossProfit, revenue);
    // const {operatingMarginScore} = calculateOperatingMargin(revenue, operatingExpenses);
    // // =>-------------- end of intermediate calculations--------------<=
    // const profitabilityHealth = (netProfitMarginScore*0.4) + (grossProfitMarginScore*0.3) + (operatingMarginScore*0.3);

    // // 3.Cash Flow Health/Stability
    // // -------------- intermediate calculations--------------
    // const calculateAvgCashflow =  () => { // avg of monthly cash flow over the period
    // const avgCashflow = math.mean(monthlyCashFlows); // monthlyCashFlows is an array of monthly cash flows over the period
    //   return avgCashflow;
    // }
    // const calculateStandardDeviationCashflow = () => {
    //   const stdDevCashflow = math.std(monthlyCashFlows);
    //   return stdDevCashflow;
    // }
    // const calculateVolatility = (avgCashflow, stdDevCashflow, smallPeriod) => {
    //   if(avgCashflow > 0){
    //     const volatility = stdDevCashflow / math.max(avgCashflow, smallPeriod);
    //     const volatilityScore = 100 -  Math.min(100,  volatility * 100);
    //     return {volatility, volatilityScore};
    //   }else{
    //     console.log("avgCashflow is low: ", avgCashflow);
    //     return 0;
    //   }
    // }
    // const calculatePositiveMonths = (monthlyCashFlows, months) => {
    //   const positiveMonths = monthlyCashFlows.filter(cashflow => cashflow > 0).length;
    //   const positiveMonthsRatio = positiveMonths / months;
    //   const positiveMonthsScore = positiveMonthsRatio * 100 ;
    //   return {positiveMonths, positiveMonthsRatio, positiveMonthsScore};
    // }

    // const calculateCoverage = (avgCashflow, monthlyOperatingExpenses) => {
    //   if(monthlyOperatingExpenses > 0){
    //     const coverage = avgCashflow / monthlyOperatingExpenses;
    //     const coverageScore = math.min(100, coverage * 50);
    //     return {coverage, coverageScore};
    //   }
    //   console.log("monthlyOperatingExpenses is low: ", monthlyOperatingExpenses);
    //   return 0;
    // }
    // //  =>-----------------end of intermediate calculations---------------------<=
    // const {volatilityScore} = calculateVolatility(avgCashflow, stdDevCashflow, smallPeriod)
    // const {positiveMonthsScore} = calculatePositiveMonths();
    // const {coverageScore} = calculateCoverage(avgCashflow, monthlyOperatingExpenses) 

    // const cashFlowStability  = (volatilityScore * 0.4) + (positiveMonthsScore * 0.3) + (coverageScore * 0.3)


    // // 2.Profitability ratio = Net Profit / Revenue
    // // 3.Cash flow sufficiency ratio = (Net Profit + Depreciation + Amortization) / Monthly Operating Expenses

  return businessFinancial; 
}
