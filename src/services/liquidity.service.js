// import { clamp, safeDivide } from "../utils/math.util.js";
// // import { BusinessFinancial } from "../models/businessFinancial.model.js";

// export const calculateLiquidityScore = (payload) => {
//   console.log(payload)
//   const {
//     cash,
//     bank_balance,
//     accounts_receivable,
//     inventory,
//     current_assets_other,
//     current_liabilities,
//     monthly_operating_expenses
//   } = payload;

//   const currentAssets =
//     cash +
//     bank_balance +
//     accounts_receivable +
//     inventory +
//     current_assets_other;

//   const quickAssets =
//     cash + bank_balance + accounts_receivable;

//   const CR = safeDivide(currentAssets, current_liabilities);
//   const QR = safeDivide(quickAssets, current_liabilities);
//   const runwayMonths = safeDivide(
//     cash + bank_balance,
//     monthly_operating_expenses
//   );

//   const CR_Score = clamp((CR / 2) * 100);
//   const QR_Score = clamp((QR / 1.5) * 100);
//   const Runway_Score = clamp((runwayMonths / 6) * 100);

//   const LH =
//     CR_Score * 0.4 +
//     QR_Score * 0.3 +
//     Runway_Score * 0.3;

//   return { LH, CR, QR, runwayMonths };
// };


import { clamp, safeDivide } from "../utils/math.util.js";

export const calculateLiquidityScore = data => {
  const {
    cash,
    bankBalance,
    accountsReceivable,
    inventory,
    currentAssetsOther,
    currentLiabilities,
    monthlyOperatingExpenses
  } = data;

  const currentAssets =
    cash +
    bankBalance +
    accountsReceivable +
    inventory +
    currentAssetsOther;

  const quickAssets =
    cash + bankBalance + accountsReceivable;

  const currentRatio = safeDivide(currentAssets, currentLiabilities);
  const quickRatio = safeDivide(quickAssets, currentLiabilities);
  const runwayMonths = safeDivide(
    cash + bankBalance,
    monthlyOperatingExpenses
  );

  const currentRatioScore = clamp((currentRatio / 2) * 100);
  const quickRatioScore = clamp((quickRatio / 1.5) * 100);
  const runwayScore = clamp((runwayMonths / 6) * 100);

  const liquidityScore =
    currentRatioScore * 0.4 +
    quickRatioScore * 0.3 +
    runwayScore * 0.3;


        let status;

  if (liquidityScore >= 85) {
    status = {
      label: "Excellent",
      color: "green",
      riskLevel: "Low",
      message: "Business is financially strong and stable."
    };
  } else if (liquidityScore >= 70) {
    status = {
      label: "Good",
      color: "lightGreen",
      riskLevel: "Low",
      message: "Healthy finances with room for optimization."
    };
  } else if (liquidityScore >= 55) {
    status = {
      label: "Fair",
      color: "yellow",
      riskLevel: "Medium",
      message: "Performance is acceptable but requires attention."
    };
  } else if (liquidityScore >= 40) {
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
    liquidityScore,
    status,
    currentRatio,
    quickRatio,
    runwayMonths
  };
};
