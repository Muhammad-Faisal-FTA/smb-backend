
import { calculateLiquidityScore } from "./liquidity.service.js";
import { calculateProfitabilityScore } from "./profitability.service.js";
import { calculateCashflowScore } from "./cashflow.service.js";
import { calculateEfficiencyScore } from "./efficiency.service.js";
import { calculateSolvencyScore } from "./solvency.service.js";
import { BusinessFinancial } from "../models/businessFinancial.model.js";

import { NotificationService } from "./notification.service.js";


export const calculateBusinessHealth = async(payload) => {
  console.log("Payload in health Score calculation: ", payload)
  const liquidity = calculateLiquidityScore(payload);
  const profitability = calculateProfitabilityScore(payload);
  const efficiency = calculateEfficiencyScore(payload);
  const solvency = calculateSolvencyScore(payload);

  const cashflow = calculateCashflowScore(
    payload.monthlyCashflows,
    payload.monthlyOperatingExpenses
  );
   const userId = payload.userId.toString();

  // 4️⃣ Persist scores in BusinessFinancial
  const update = await BusinessFinancial.findOneAndUpdate(
    { userId: userId},
    {
      scoreLH: liquidity.liquidityScore,  //NaN
      scorePH: profitability.profitabilityScore,
      scoreCS: cashflow.cashflowScore,   //NaN
      scoreEH: efficiency.efficiencyScore,
      scoreSH: solvency.solvencyScore,
    },
    { new: true }
  );
console.log("values before Score:", liquidity.liquidityScore,
      profitability.profitabilityScore,
       cashflow.cashflowScore,
     efficiency.efficiencyScore,
       solvency.solvencyScore,)
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
     await NotificationService.create({
      userId,
      type: "CRITICAL",
      title: "Financial Health Alert",
      message: "Your financial health is Goog.",
      category: "HEALTH"
    });
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
     await NotificationService.create({
      userId,
      type: "CRITICAL",
      title: "Financial Health Alert",
      message: "Your financial health is critically low.Financial risk is increasing. Action recommended.",
      category: "HEALTH"
    });
  } else if (finalScore >= 40) {
    status = {
      label: "Weak",
      color: "orange",
      riskLevel: "High",
      message: "Financial risk is increasing. Action recommended."
    };
     await NotificationService.create({
      userId,
      type: "CRITICAL",
      title: "Financial Health Alert",
      message: "Your financial health is critically low.Financial risk is increasing. Action recommended.",
      category: "HEALTH"
    });
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
