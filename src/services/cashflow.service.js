import { clamp, mean, stdDev, safeDivide } from "../utils/math.util.js";

export const calculateCashflowScore = (
  monthlyCashflows,
  monthlyOperatingExpenses
) => {
  if (!Array.isArray(monthlyCashflows) || monthlyCashflows.length < 1) {
    return {
      cashflowScore: 0,
      volatility: null,
      coverage: null,
      warning: "Insufficient monthly cashflow data"
    };
  }

  const avgCashflow = mean(monthlyCashflows);
  const cashflowStdDev = stdDev(monthlyCashflows);

  const volatility = safeDivide(
    cashflowStdDev,
    Math.abs(avgCashflow),
    1
  );

  const positiveMonths =
    monthlyCashflows.filter(v => v > 0).length;

  const volatilityScore = clamp(100 - volatility * 100);
  const positiveCashflowScore = clamp(
    (positiveMonths / monthlyCashflows.length) * 100
  );

  const coverage = safeDivide(
    avgCashflow,
    monthlyOperatingExpenses
  );
  const coverageScore = clamp(coverage * 50);

  const cashflowScore =
    volatilityScore * 0.4 +
    positiveCashflowScore * 0.3 +
    coverageScore * 0.3;

  let status;
  if (cashflowScore >= 85) {
    status = {
      label: "Excellent",
      color: "green",
      riskLevel: "Low",
      message: "Business is financially strong and stable."
    };
  } else if (cashflowScore >= 70) {
    status = {
      label: "Good",
      color: "lightGreen",
      riskLevel: "Low",
      message: "Healthy finances with room for optimization."
    };
  } else if (cashflowScore >= 55) {
    status = {
      label: "Fair",
      color: "yellow",
      riskLevel: "Medium",
      message: "Performance is acceptable but requires attention."
    };
  } else if (cashflowScore >= 40) {
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
    cashflowScore,
    volatility,
    coverage
  };
};
