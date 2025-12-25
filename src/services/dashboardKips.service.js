// import { User } from "../models/user.model.js";
// import { BusinessProfile } from "../models/businessProfile.model.js";
// import { DailyHistory } from "../models/dailyHistory.model.js";

// export const dashboardKpi = async () => {

//   /* ---------------- PLATFORM KPIs ---------------- */
//   const totalUsers = await User.countDocuments();
//   const totalBusinesses = await BusinessProfile.countDocuments();

//   /* ---------------- FINANCIAL AGGREGATION ---------------- */
//   const financialAgg = await DailyHistory.aggregate([
//     {
//       $group: {
//         _id: null,
//         totalRevenue: { $sum: "$revenue" },
//         totalExpenses: { $sum: "$expenses" },
//         avgCash: { $avg: "$cashBalance" },
//         avgPayables: { $avg: "$payables" }
//       }
//     }
//   ]);

//   const finance = financialAgg[0] || {
//     totalRevenue: 0,
//     totalExpenses: 0,
//     avgCash: 0,
//     avgPayables: 0
//   };

//   const netProfit =
//     finance.totalRevenue - finance.totalExpenses;

//   /* ---------------- RATIOS ---------------- */
//   const profitabilityRatio =
//     finance.totalRevenue > 0
//       ? (netProfit / finance.totalRevenue) * 100
//       : 0;

//   const liquidityRatio =
//     finance.avgPayables > 0
//       ? finance.avgCash / finance.avgPayables
//       : 0;

//   /* ---------------- CASHFLOW TREND ---------------- */
//   const cashflowHistory = await DailyHistory
//     .find({})
//     .sort({ date: -1 })
//     .limit(2)
//     .select("cashBalance");

//   const cashflowTrend =
//     cashflowHistory.length === 2
//       ? cashflowHistory[0].cashBalance -
//         cashflowHistory[1].cashBalance
//       : 0;

//   /* ---------------- 6-MONTH CHART DATA ---------------- */
//   const monthlyTrend = await DailyHistory.aggregate([
//     {
//       $group: {
//         _id: { $month: "$date" },
//         revenue: { $sum: "$revenue" },
//         expenses: { $sum: "$expenses" }
//       }
//     },
//     { $sort: { "_id": 1 } }
//   ]);

//   /* ---------------- FINAL KPI RESPONSE ---------------- */
//   return {
//     users: {
//       total: totalUsers
//     },
//     businesses: {
//       total: totalBusinesses
//     },
//     finance: {
//       revenue: finance.totalRevenue,
//       expenses: finance.totalExpenses,
//       netProfit
//     },
//     ratios: {
//       profitabilityRatio: Number(profitabilityRatio.toFixed(1)),
//       liquidityRatio: Number(liquidityRatio.toFixed(2))
//     },
//     cashflow: {
//       trend: cashflowTrend,
//       status: cashflowTrend >= 0 ? "Positive" : "Negative"
//     },
//     chart: {
//       revenueVsExpenses: monthlyTrend
//     }
//   };
// };


import { BusinessFinancial } from "../models/businessFinancial.model.js";

export const dashboardKpi = async (userId) => {
  
  /* ---------------- GET CURRENT PERIOD DATA ---------------- */
  // Get the most recent financial record for the user
  const currentPeriod = await BusinessFinancial
    .findOne({ userId })
    .sort({ periodEnd: -1 })
    .lean();

  if (!currentPeriod) {
    throw new Error("No financial data found for user");
  }

  /* ---------------- GET PREVIOUS PERIOD DATA (for comparison) ---------------- */
  const previousPeriod = await BusinessFinancial
    .findOne({ 
      userId,
      periodEnd: { $lt: currentPeriod.periodEnd }
    })
    .sort({ periodEnd: -1 })
    .lean();

  /* ---------------- CALCULATE TOTAL REVENUE ---------------- */
  const totalRevenue = currentPeriod.revenue;
  const prevRevenue = previousPeriod?.revenue || 0;
  const revenueChange = prevRevenue > 0 
    ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 
    : 0;

  /* ---------------- CALCULATE TOTAL EXPENSES ---------------- */
  const totalExpenses = currentPeriod.operatingExpenses + currentPeriod.cogs;
  const prevExpenses = previousPeriod 
    ? (previousPeriod.operatingExpenses + previousPeriod.cogs) 
    : 0;
  const expensesChange = prevExpenses > 0 
    ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 
    : 0;

  /* ---------------- CALCULATE NET PROFIT ---------------- */
  const netProfit = currentPeriod.netProfit;
  const prevNetProfit = previousPeriod?.netProfit || 0;
  const profitChange = prevNetProfit !== 0
    ? ((netProfit - prevNetProfit) / Math.abs(prevNetProfit)) * 100 
    : 0;

  /* ---------------- CASHFLOW TREND ---------------- */
  // Calculate current total cash (cash + bank balance)
  const currentCash = currentPeriod.cash + currentPeriod.bankBalance;
  const previousCash = previousPeriod 
    ? (previousPeriod.cash + previousPeriod.bankBalance) 
    : currentCash;
  
  const cashflowTrend = currentCash - previousCash;
  const cashflowStatus = cashflowTrend >= 0 ? "Positive" : "Negative";

  /* ---------------- PROFITABILITY RATIO ---------------- */
  // Profitability Ratio = (Net Profit / Revenue) × 100
  const profitabilityRatio = totalRevenue > 0 
    ? (netProfit / totalRevenue) * 100 
    : 0;
  
  const prevProfitabilityRatio = prevRevenue > 0 && previousPeriod
    ? (prevNetProfit / prevRevenue) * 100 
    : 0;
  
  const profitabilityChange = prevProfitabilityRatio !== 0
    ? ((profitabilityRatio - prevProfitabilityRatio) / Math.abs(prevProfitabilityRatio)) * 100
    : 0;

  /* ---------------- LIQUIDITY RATIO (Current Ratio) ---------------- */
  // Liquidity Ratio = Current Assets / Current Liabilities
  const currentAssets = 
    currentPeriod.cash + 
    currentPeriod.bankBalance + 
    currentPeriod.accountsReceivable + 
    currentPeriod.inventory + 
    currentPeriod.currentAssetsOther;

  const liquidityRatio = currentPeriod.currentLiabilities > 0 
    ? currentAssets / currentPeriod.currentLiabilities 
    : 0;

  const prevCurrentAssets = previousPeriod 
    ? (previousPeriod.cash + 
       previousPeriod.bankBalance + 
       previousPeriod.accountsReceivable + 
       previousPeriod.inventory + 
       previousPeriod.currentAssetsOther)
    : 0;

  const prevLiquidityRatio = previousPeriod && previousPeriod.currentLiabilities > 0
    ? prevCurrentAssets / previousPeriod.currentLiabilities 
    : 0;

  const liquidityChange = prevLiquidityRatio !== 0
    ? ((liquidityRatio - prevLiquidityRatio) / Math.abs(prevLiquidityRatio)) * 100
    : 0;

  /* ---------------- GET LAST 6 MONTHS DATA FOR CHART ---------------- */
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = await BusinessFinancial
    .find({ 
      userId,
      periodEnd: { $gte: sixMonthsAgo }
    })
    .sort({ periodEnd: 1 })
    .select('revenue operatingExpenses cogs periodEnd')
    .lean();

  const chartData = monthlyData.map(record => ({
    month: new Date(record.periodEnd).toLocaleString('default', { month: 'short' }),
    revenue: record.revenue,
    expenses: record.operatingExpenses + record.cogs,
    period: record.periodEnd
  }));

  /* ---------------- FINAL KPI RESPONSE ---------------- */
  return {
    // Card 1: Total Revenue
    revenue: {
      value: totalRevenue,
      label: "Total Revenue",
      sublabel: "vs last month",
      change: Number(revenueChange.toFixed(1)),
      changeType: revenueChange >= 0 ? "increase" : "decrease"
    },

    // Card 2: Total Expenses
    expenses: {
      value: totalExpenses,
      label: "Total Expenses",
      sublabel: "vs last month",
      change: Number(expensesChange.toFixed(1)),
      changeType: expensesChange >= 0 ? "increase" : "decrease"
    },

    // Card 3: Net Profit
    profit: {
      value: netProfit,
      label: "Net Profit",
      sublabel: "vs last month",
      change: Number(profitChange.toFixed(1)),
      changeType: profitChange >= 0 ? "increase" : "decrease"
    },

    // Card 4: Cashflow Trend
    cashflow: {
      value: cashflowTrend,
      status: cashflowStatus,
      label: "Cashflow Trend",
      sublabel: "this month",
      currentCash: currentCash
    },

    // Card 5: Profitability Ratio
    profitability: {
      value: Number(profitabilityRatio.toFixed(1)),
      label: "Profitability Ratio",
      sublabel: "vs last month",
      change: Number(profitabilityChange.toFixed(1)),
      changeType: profitabilityChange >= 0 ? "increase" : "decrease"
    },

    // Card 6: Liquidity Ratio
    liquidity: {
      value: Number(liquidityRatio.toFixed(2)),
      label: "Liquidity Ratio",
      sublabel: "vs last month",
      change: Number(liquidityChange.toFixed(2)),
      changeType: liquidityChange >= 0 ? "increase" : "decrease",
      status: liquidityRatio >= 1.5 ? "healthy" : liquidityRatio >= 1 ? "adequate" : "warning"
    },

    // Chart Data
    chart: {
      monthlyData: chartData
    },

    // Period Information
    period: {
      current: {
        start: currentPeriod.periodStart,
        end: currentPeriod.periodEnd
      },
      previous: previousPeriod ? {
        start: previousPeriod.periodStart,
        end: previousPeriod.periodEnd
      } : null
    }
  };
};


/* ---------------- HELPER FUNCTION: Format Currency ---------------- */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};


/* ---------------- HELPER FUNCTION: Format Percentage ---------------- */
export const formatPercentage = (value, decimals = 1) => {
  const formatted = value.toFixed(decimals);
  return value >= 0 ? `+${formatted}%` : `${formatted}%`;
};