// import { clamp, safeDivide } from "../utils/math.util.js";

// export const calculateEfficiencyScore = data => {
//   const {
//     cogs,
//     avg_inventory,
//     receivables,
//     payables,
//     revenue
//   } = data;

//   const invTurn = safeDivide(cogs, avg_inventory);
//   const DSO = safeDivide(receivables, revenue) * 365;
//   const DPO = safeDivide(payables, cogs) * 365;

//   const Inv_Score = clamp((invTurn / 12) * 100);
//   const DSO_Score = clamp(100 - (DSO / 45) * 100);
//   const DPO_Score = clamp((DPO / 60) * 100);

//   const EH =
//     Inv_Score * 0.3 +
//     DSO_Score * 0.4 +
//     DPO_Score * 0.3;

//   return { EH, invTurn, DSO, DPO };
// };




import { clamp, safeDivide } from "../utils/math.util.js";

export const calculateEfficiencyScore = data => {
  const {
    cogs,
    avgInventory,
    accountsReceivable,
    payables,
    revenue
  } = data;

  const inventoryTurnover = safeDivide(cogs, avgInventory);
  const dso = safeDivide(accountsReceivable, revenue) * 365;
  const dpo = safeDivide(payables, cogs) * 365;

  const inventoryScore = clamp((inventoryTurnover / 12) * 100);
  const dsoScore = clamp(100 - (dso / 45) * 100);
  const dpoScore = clamp((dpo / 60) * 100);

  const efficiencyScore =
    inventoryScore * 0.3 +
    dsoScore * 0.4 +
    dpoScore * 0.3;
     
  let status;
  if (efficiencyScore >= 85) {
    status = {
      label: "Excellent",
      color: "green",
      riskLevel: "Low",
      message: "Business is financially strong and stable."
    };
  } else if (efficiencyScore >= 70) {
    status = {
      label: "Good",
      color: "lightGreen",
      riskLevel: "Low",
      message: "Healthy finances with room for optimization."
    };
  } else if (efficiencyScore >= 55) {
    status = {
      label: "Fair",
      color: "yellow",
      riskLevel: "Medium",
      message: "Performance is acceptable but requires attention."
    };
  } else if (efficiencyScore >= 40) {
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
    efficiencyScore,
    inventoryTurnover,
    dso,
    dpo
  };
};

