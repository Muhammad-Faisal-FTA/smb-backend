// import { clamp, safeDivide } from "../utils/math.util.js";

// export const calculateProfitabilityScore = data => {
//   const {
//     revenue,
//     gross_profit,
//     net_profit,
//     operating_expenses
//   } = data;

//   const NPM = safeDivide(net_profit, revenue);
//   const GM = safeDivide(gross_profit, revenue);
//   const OPM = safeDivide(
//     revenue - operating_expenses,
//     revenue
//   );

//   const NPM_Score = clamp(NPM * 1000);
//   const GM_Score = clamp(GM * 200);
//   const OPM_Score = clamp(OPM * 300);

//   const PH =
//     NPM_Score * 0.4 +
//     GM_Score * 0.3 +
//     OPM_Score * 0.3;

//   return { PH, NPM, GM, OPM };
// };


import { clamp, safeDivide } from "../utils/math.util.js";

export const calculateProfitabilityScore = data => {
  const {
    revenue,
    grossProfit,
    netProfit,
    operatingExpenses
  } = data;

  const netProfitMargin = safeDivide(netProfit, revenue);
  const grossMargin = safeDivide(grossProfit, revenue);
  const operatingMargin = safeDivide(
    revenue - operatingExpenses,
    revenue
  );

  const netProfitScore = clamp(netProfitMargin * 1000);
  const grossMarginScore = clamp(grossMargin * 200);
  const operatingMarginScore = clamp(operatingMargin * 300);

  const profitabilityScore =
    netProfitScore * 0.4 +
    grossMarginScore * 0.3 +
    operatingMarginScore * 0.3;


  let status;
  if (profitabilityScore >= 85) {
    status = {
      label: "Excellent",
      color: "green",
      riskLevel: "Low",
      message: "Business is financially strong and stable."
    };
  } else if (profitabilityScore >= 70) {
    status = {
      label: "Good",
      color: "lightGreen",
      riskLevel: "Low",
      message: "Healthy finances with room for optimization."
    };
  } else if (profitabilityScore >= 55) {
    status = {
      label: "Fair",
      color: "yellow",
      riskLevel: "Medium",
      message: "Performance is acceptable but requires attention."
    };
  } else if (profitabilityScore >= 40) {
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
    profitabilityScore,
    status,
    netProfitMargin,
    grossMargin,
    operatingMargin
  };
};
