// import { clamp, safeDivide } from "../utils/math.util.js";

// export const calculateSolvencyScore = data => {
//   const {
//     total_debt,
//     total_equity,
//     ebitda,
//     interest_expense
//   } = data;

//   const DE = safeDivide(total_debt, total_equity, 10);
//   const ICR = safeDivide(ebitda, interest_expense, 10);
//   const debtEBITDA = safeDivide(total_debt, ebitda, 10);

//   const DE_Score = clamp(100 - (DE / 2) * 100);
//   const ICR_Score = clamp((ICR / 5) * 100);
//   const DEBT_EBITDA_Score = clamp(
//     100 - (debtEBITDA / 4) * 100
//   );

//   const SH =
//     DE_Score * 0.4 +
//     ICR_Score * 0.3 +
//     DEBT_EBITDA_Score * 0.3;

//   return { SH, DE, ICR, debtEBITDA };
// };


import { clamp, safeDivide } from "../utils/math.util.js";

export const calculateSolvencyScore = data => {
  const {
    totalDebt,
    totalEquity,
    ebitda,
    interestExpense
  } = data;

  const debtToEquity = safeDivide(totalDebt, totalEquity, 10);
  const interestCoverage = safeDivide(ebitda, interestExpense, 10);
  const debtToEbitda = safeDivide(totalDebt, ebitda, 10);

  const debtEquityScore = clamp(100 - (debtToEquity / 2) * 100);
  const interestCoverageScore = clamp((interestCoverage / 5) * 100);
  const debtEbitdaScore = clamp(
    100 - (debtToEbitda / 4) * 100
  );

  const solvencyScore =
    debtEquityScore * 0.4 +
    interestCoverageScore * 0.3 +
    debtEbitdaScore * 0.3;
    

  let status;
  if (solvencyScore >= 85) {
    status = {
      label: "Excellent",
      color: "green",
      riskLevel: "Low",
      message: "Business is financially strong and stable."
    };
  } else if (solvencyScore >= 70) {
    status = {
      label: "Good",
      color: "lightGreen",
      riskLevel: "Low",
      message: "Healthy finances with room for optimization."
    };
  } else if (solvencyScore >= 55) {
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
    solvencyScore,
    status,
    debtToEquity,
    interestCoverage,
    debtToEbitda
  };
};
