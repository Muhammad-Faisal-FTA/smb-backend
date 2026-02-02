import { calculateLiquidityScore } from "./liquidity.service.js";
import { calculateProfitabilityScore } from "./profitability.service.js";
import { calculateCashflowScore } from "./cashflow.service.js";
import { calculateEfficiencyScore } from "./efficiency.service.js";
import { calculateSolvencyScore } from "./solvency.service.js";
import { BusinessFinancial } from "../models/businessFinancial.model.js";

/**
 * Normalize raw financial payload into
 * a strict, scoring-safe domain object
 */
function normalizeFinancialPayload(financialData, options = {}) {
  // Convert Mongoose doc → plain object so spread works correctly
  const data = financialData.toObject ? financialData.toObject() : financialData;

  const start = new Date(data.periodStart);
  const end = new Date(data.periodEnd);

  let durationInMonths = 12;

  if (!isNaN(start) && !isNaN(end) && end > start) {
    durationInMonths = (end - start) / (1000 * 60 * 60 * 24 * 30);
  }

  const currentAssets =
    (data.cash || 0) +
    (data.bankBalance || 0) +
    (data.accountsReceivable || 0) +
    (data.inventory || 0) +
    (data.currentAssetsOther || 0);

  const operatingProfit =
    (data.revenue || 0) - (data.operatingExpenses || 0);

  const hasTimeSeriesData =
    Array.isArray(options.monthlyCashflows) &&
    options.monthlyCashflows.length > 1;

  if (hasTimeSeriesData) {
    const monthlyExpenses = Array.isArray(options.monthlyExpenses)
      ? options.monthlyExpenses
      : [Number(options.monthlyExpenses || 0)];

    const avgMonthlyExpenses =
      monthlyExpenses.reduce((a, b) => a + Number(b || 0), 0) /
      monthlyExpenses.length;

    return {
      ...data,                          // ✅ now spreads the actual fields
      scoringMode: "TIME_SERIES",
      currentAssets,
      operatingProfit,
      monthlyCashflows: options.monthlyCashflows.map(Number),
      monthlyOperatingExpenses: avgMonthlyExpenses
    };
  }

  return {
    ...data,                            // ✅ now spreads the actual fields
    scoringMode: "DURATION_BASED",
    currentAssets,
    operatingProfit,
    monthlyCashflows: [Number(data.netProfit || 0) / durationInMonths],
    monthlyOperatingExpenses: Number(data.operatingExpenses || 0) / durationInMonths
  };
}

/**
 * Main business health calculation
 */
export const calculateBusinessHealth = async (
  financialData,
  options = {}
) => {
  const payload = normalizeFinancialPayload(financialData, options);

  console.log("Payload in health score calculation:", payload);

  const liquidity = calculateLiquidityScore(payload);
  const profitability = calculateProfitabilityScore(payload);
  const efficiency = calculateEfficiencyScore(payload);
  const solvency = calculateSolvencyScore(payload);

  const cashflow = calculateCashflowScore(
    payload.monthlyCashflows,
    payload.monthlyOperatingExpenses
  );

  const safe = (v) => (Number.isFinite(v) ? v : 0);

  const userId = payload.userId;

  // ✅ Persist individual scores
  await BusinessFinancial.findOneAndUpdate(
    { userId },
    {
      scoreLH: safe(liquidity.liquidityScore),
      scorePH: safe(profitability.profitabilityScore),
      scoreCS: safe(cashflow.cashflowScore),
      scoreEH: safe(efficiency.efficiencyScore),
      scoreSH: safe(solvency.solvencyScore)
    },
    { new: true }
  );

  console.log(
    "Scores:",
    safe(liquidity.liquidityScore),
    safe(profitability.profitabilityScore),
    safe(cashflow.cashflowScore),
    safe(efficiency.efficiencyScore),
    safe(solvency.solvencyScore)
  );

  const finalScore =
    safe(liquidity.liquidityScore) * 0.25 +
    safe(profitability.profitabilityScore) * 0.25 +
    safe(cashflow.cashflowScore) * 0.20 +
    safe(efficiency.efficiencyScore) * 0.15 +
    safe(solvency.solvencyScore) * 0.15;

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




// import { calculateLiquidityScore } from "./liquidity.service.js";
// import { calculateProfitabilityScore } from "./profitability.service.js";
// import { calculateCashflowScore } from "./cashflow.service.js";
// import { calculateEfficiencyScore } from "./efficiency.service.js";
// import { calculateSolvencyScore } from "./solvency.service.js";
// import { BusinessFinancial } from "../models/businessFinancial.model.js";

// // healthScore.service.js

// function normalizeFinancialPayload(financialData, options = {}) {
//   const start = new Date(financialData.periodStart);
//   const end = new Date(financialData.periodEnd);

//   let durationInMonths = 12; // safe default

//   if (!isNaN(start) && !isNaN(end) && end > start) {
//     durationInMonths =
//       (end - start) / (1000 * 60 * 60 * 24 * 30);
//   }

//   // 🔑 DOMAIN NORMALIZATION (always computed)
//   const currentAssets =
//     (financialData.cash || 0) +
//     (financialData.bankBalance || 0) +
//     (financialData.accountsReceivable || 0) +
//     (financialData.inventory || 0) +
//     (financialData.currentAssetsOther || 0);

//   const operatingProfit =
//     (financialData.revenue || 0) -
//     (financialData.operatingExpenses || 0);

//   const hasTimeSeriesData =
//     Array.isArray(options.monthlyCashflows) &&
//     options.monthlyCashflows.length > 1;

//   // 🟢 REGULAR USER
//   if (hasTimeSeriesData) {
//     return {
//       ...financialData,
//       scoringMode: "TIME_SERIES",

//       // normalized fields
//       currentAssets,
//       operatingProfit,

//       monthlyCashflows: options.monthlyCashflows,
//       monthlyOperatingExpenses: Number(options.monthlyExpenses) || 0
//     };
//   }

//   // 🟡 NEW USER (duration-based)
//   return {
//     ...financialData,
//     scoringMode: "DURATION_BASED",

//     // normalized fields
//     currentAssets,
//     operatingProfit,

//     monthlyCashflows: [
//       Number(financialData.netProfit || 0) / durationInMonths
//     ],
//     monthlyOperatingExpenses:
//       Number(financialData.operatingExpenses || 0) / durationInMonths
//   };
// }



// export const calculateBusinessHealth = async (
//   financialData,
//   options = {}
// ) => {
//   const payload = normalizeFinancialPayload(financialData, options);
//   console.log("Payload in health Score calculation: ", payload)
//   const liquidity = calculateLiquidityScore(payload);
//   const profitability = calculateProfitabilityScore(payload);
//   const efficiency = calculateEfficiencyScore(payload);
//   const solvency = calculateSolvencyScore(payload);

//   const cashflow = calculateCashflowScore(
//     payload.monthlyCashflows,
//     payload.monthlyOperatingExpenses
//   );
//   const userId = payload.userId;

//   // 4️⃣ Persist scores in BusinessFinancial
//   const update = await BusinessFinancial.findOneAndUpdate(
//     { userId: userId},
//     {
//       scoreLH: liquidity.liquidityScore,  //NaN
//       scorePH: profitability.profitabilityScore,
//       scoreCS: cashflow.cashflowScore,   //NaN
//       scoreEH: efficiency.efficiencyScore,
//       scoreSH: solvency.solvencyScore,
//     },
//     { new: true }
//   );
// console.log("values before Score:", liquidity.liquidityScore,
//       profitability.profitabilityScore,
//        cashflow.cashflowScore,
//      efficiency.efficiencyScore,
//        solvency.solvencyScore,)
//   const finalScore =
//     liquidity.liquidityScore * 0.25 +
//     profitability.profitabilityScore * 0.25 +
//     cashflow.cashflowScore * 0.20 +
//     efficiency.efficiencyScore * 0.15 +
//     solvency.solvencyScore * 0.15;

//     let status;

//   if (finalScore >= 85) {
//     status = {
//       label: "Excellent",
//       color: "green",
//       riskLevel: "Low",
//       message: "Business is financially strong and stable."
//     };
//   } else if (finalScore >= 70) {
//     status = {
//       label: "Good",
//       color: "lightGreen",
//       riskLevel: "Low",
//       message: "Healthy finances with room for optimization."
//     };
//   } else if (finalScore >= 55) {
//     status = {
//       label: "Fair",
//       color: "yellow",
//       riskLevel: "Medium",
//       message: "Performance is acceptable but requires attention."
//     };
//   } else if (finalScore >= 40) {
//     status = {
//       label: "Weak",
//       color: "orange",
//       riskLevel: "High",
//       message: "Financial risk is increasing. Action recommended."
//     };
//   } else {
//     status = {
//       label: "Critical",
//       color: "red",
//       riskLevel: "Very High",
//       message: "Immediate financial intervention required."
//     };
//   }


//   return {
//     finalScore: Math.round(finalScore),
//     status,
//     breakdown: {
//       liquidity,
//       profitability,
//       cashflow,
//       efficiency,
//       solvency
//     }
//   };
// };
