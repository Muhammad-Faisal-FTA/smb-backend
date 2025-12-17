// import { BusinessFinancial } from "../models/businessFinancial.model.js";
// import { calculateLiquidityScore } from "./liquidity.service.js";
// import { calculateProfitabilityScore } from "./profitability.service.js";
// import { calculateCashflowScore } from "./cashflow.service.js";
// import { calculateEfficiencyScore } from "./efficiency.service.js";
// import { calculateSolvencyScore } from "./solvency.service.js";

// export const calculateBusinessHealth = (payload) => {
  
//   const normalize = (d)=> ({
//   cash: Number(d.cash),
//   bank_balance: Number(d.bankBalance),
//   accounts_receivable: Number(d.accountsReceivable),
//   inventory: Number(d.inventory),
//   current_assets_other: Number(d.currentAssetsOther),
//   current_liabilities: Number(d.currentLiabilities),
//   monthly_operating_expenses: Number(d.monthlyOperatingExpenses),

//   revenue: Number(d.revenue),
//   gross_profit: Number(d.grossProfit),
//   net_profit: Number(d.netProfit),
//   operating_expenses: Number(d.operatingExpenses),
//   cogs: Number(d.cogs),

//   avg_inventory: Number(d.avgInventory),
//   receivables: Number(d.accountsReceivable),
//   payables: Number(d.payables),

//   total_debt: Number(d.totalDebt),
//   total_equity: Number(d.totalEquity),
//   ebitda: Number(d.ebitda),
//   interest_expense: Number(d.interestExpense),

//   monthly_cashflows: Array.isArray(d.monthlyCashflows)
//     ? d.monthlyCashflows.map(Number)
//     : []
// });

// const d = normalize(payload);
// console.log("Normalize data",d);
// // payload = BusinessFinancial.body;
//     // console.log(payload);
//   const liquidity = calculateLiquidityScore(payload);
//   const profitability = calculateProfitabilityScore(payload);
//   const efficiency = calculateEfficiencyScore(payload);
//   const solvency = calculateSolvencyScore(payload);

//   const cashflow = calculateCashflowScore(
//     payload.monthlyCashflows,
//     payload.monthlyOperatingExpenses
//   );

//   const finalScore =
//     liquidity.LH * 0.25 +
//     profitability.PH * 0.25 +
//     cashflow.CS * 0.20 +
//     efficiency.EH * 0.15 +
//     solvency.SH * 0.15;

//   return {
//     finalScore: Math.round(finalScore),
//     breakdown: {
//       liquidity,
//       profitability,
//       cashflow,
//       efficiency,
//       solvency
//     }
//   };
// };




import { calculateLiquidityScore } from "../liquidity.service.js";
import { calculateProfitabilityScore } from "../profitability.service.js";
import { calculateCashflowScore } from "../cashflow.service.js";
import { calculateEfficiencyScore } from "../efficiency.service.js";
import { calculateSolvencyScore } from "../solvency.service.js";

export const calculateBusinessHealth = payload => {
  const liquidity = calculateLiquidityScore(payload);
  const profitability = calculateProfitabilityScore(payload);
  const efficiency = calculateEfficiencyScore(payload);
  const solvency = calculateSolvencyScore(payload);

  const cashflow = calculateCashflowScore(
    payload.monthlyCashflows,
    payload.monthlyOperatingExpenses
  );

  const finalScore =
    liquidity.liquidityScore * 0.25 +
    profitability.profitabilityScore * 0.25 +
    cashflow.cashflowScore * 0.20 +
    efficiency.efficiencyScore * 0.15 +
    solvency.solvencyScore * 0.15;

    let status;

  if (finalScore >= 85) {
    status = {
      label: "Excellent",
      color: "green",
      riskLevel: "Low",
      message: "Business is financially strong and stable."
    };
  } else if (finalScore >= 70) {
    status = {
      label: "Good",
      color: "lightGreen",
      riskLevel: "Low",
      message: "Healthy finances with room for optimization."
    };
  } else if (finalScore >= 55) {
    status = {
      label: "Fair",
      color: "yellow",
      riskLevel: "Medium",
      message: "Performance is acceptable but requires attention."
    };
  } else if (finalScore >= 40) {
    status = {
      label: "Weak",
      color: "orange",
      riskLevel: "High",
      message: "Financial risk is increasing. Action recommended."
    };
  } else {
    status = {
      label: "Critical",
      color: "red",
      riskLevel: "Very High",
      message: "Immediate financial intervention required."
    };
  }


  return {
    finalScore: Math.round(finalScore),
    status,
    breakdown: {
      liquidity,
      profitability,
      cashflow,
      efficiency,
      solvency
    }
  };
};
