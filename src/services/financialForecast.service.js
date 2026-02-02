// import { Revenue } from "../models/revenueInput.model.js"
// import { ExpenseInput} from "../models/expenseInput.model.js";
// import { BusinessFinancial } from "../models/businessFinancial.model.js";
// import { ApiError } from "../utils/ApiError.utils.js";

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// //  Trends an avg
// const calculateTrend = (values) => {
//   if (!Array.isArray(values) || values.length < 2) {
//     return { avg: 0, growthRate: 0 };
//   }

//   // Remove invalid numbers
//   const cleanValues = values.filter(
//     v => typeof v === "number" && !isNaN(v) && v > 0
//   );

//   if (cleanValues.length < 2) {
//     return { avg: 0, growthRate: 0 };
//   }

//   const avg =
//     cleanValues.reduce((a, b) => a + b, 0) / cleanValues.length;

//   const first = cleanValues[0];
//   const last = cleanValues[cleanValues.length - 1];

//   const growthRate =
//     first === 0 ? 0 : (last - first) / first;

//   return { avg, growthRate };
// };



// export const generateFinancialForecastService = async ({ userId }) => {
//   // 1️⃣ Fetch historical monthly revenue
//   const revenues = await Revenue.find({ userId })
//     .sort({ periodValue: 1 });
//   console.log("evenue 1" , revenues)
//   // 2️⃣ Fetch historical monthly expenses
//   const expenses = await ExpenseInput.find({userId} )
//   .sort({ periodValue: 1 });
//   console.log("expenc " , expenses)
  
//   // 3️⃣ Fetch current cash position
//   const financials = await BusinessFinancial.findOne({ userId });
//   console.log("fin" , financials)

//   if (!financials) {
//     throw new ApiError(404, "Business financials not found");
//   }

//   // 4️⃣ Extract numeric series
//   const revenueValues = revenues.map(r => r.monthlyRevenue);
//   const expenseValues = expenses.map(e => e.totalMonthlyExpenses);
//   const currentCash = financials.cashBalance;

//   console.log("revenueValues",revenueValues)
//   console.log("expencealues",expenseValues)
//   console.log("revenueValues",currentCash)

//   if (!revenueValues.length || !expenseValues.length) {
//     throw new ApiError(400, "Insufficient historical data for forecast");
//   }

//   // 5️⃣ Compute baseline stats
//   const revenueStats = calculateTrend(revenueValues);
//   const expenseStats = calculateTrend(expenseValues);

//   const expectedRevenue =
//     revenueStats.avg * (1 + revenueStats.growthRate);

//   const expectedExpenses =
//     expenseStats.avg * (1 + expenseStats.growthRate);

//   const expectedCashFlow =
//     expectedRevenue - expectedExpenses;

//   // 6️⃣ Cash scenarios
//   const cashForecast = {
//     pessimistic: currentCash + expectedCashFlow * 0.6,
//     expected: currentCash + expectedCashFlow,
//     optimistic: currentCash + expectedCashFlow * 1.4
//   };

//   // 7️⃣ Ask AI to interpret + explain
//   const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

//   const prompt = `
// You are a financial forecasting AI.

// Given:
// - Average monthly revenue: ${revenueStats.avg}
// - Revenue growth rate: ${revenueStats.growthRate}
// - Average monthly expenses: ${expenseStats.avg}
// - Expense growth rate: ${expenseStats.growthRate}
// - Current cash balance: ${currentCash}

// Tasks:
// 1. Forecast next month's revenue
// 2. Forecast next month's expenses
// 3. Forecast cash flow
// 4. Explain pessimistic, expected, and optimistic cash scenarios
// 5. Keep explanations concise, professional, and finance-grade
// `;

//   const aiResponse = await model.generateContent(prompt);
//   const aiInsight = aiResponse.response.text();

//   // 8️⃣ Final response
//   return {
//     forecast: {
//       revenue: Math.round(expectedRevenue),
//       expenses: Math.round(expectedExpenses),
//       cashFlow: Math.round(expectedCashFlow),
//       cashScenarios: {
//         pessimistic: Math.round(cashForecast.pessimistic),
//         expected: Math.round(cashForecast.expected),
//         optimistic: Math.round(cashForecast.optimistic)
//       }
//     },
//     aiInsight
//   };
// };


// import { Revenue } from "../models/revenueInput.model.js"
// import { ExpenseInput } from "../models/expenseInput.model.js";
// import { BusinessFinancial } from "../models/businessFinancial.model.js";
// import { ApiError } from "../utils/ApiError.utils.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Trends and avg
// const calculateTrend = (values) => {
//   if (!Array.isArray(values) || values.length < 2) {
//     return { avg: 0, growthRate: 0 };
//   }

//   // Remove invalid numbers
//   const cleanValues = values.filter(
//     v => typeof v === "number" && !isNaN(v) && v > 0
//   );

//   if (cleanValues.length < 2) {
//     return { avg: 0, growthRate: 0 };
//   }

//   const avg = cleanValues.reduce((a, b) => a + b, 0) / cleanValues.length;
//   const first = cleanValues[0];
//   const last = cleanValues[cleanValues.length - 1];
//   const growthRate = first === 0 ? 0 : (last - first) / first;

//   return { avg, growthRate };
// };

// // Helper to calculate total expenses from expense object
// const calculateTotalExpenses = (expense) => {
//   return (
//     (expense.inventoryPurchases || 0) +
//     (expense.loanInstallments || 0) +
//     (expense.marketingSpend || 0) +
//     (expense.operatingExpenses || 0) +
//     (expense.payroll || 0) +
//     (expense.rentAndUtilities || 0) +
//     (expense.taxPayments || 0)
//   );
// };

// export const generateFinancialForecastService = async ({ userId }) => {
//   // 1️⃣ Fetch historical monthly revenue
//   const revenues = await Revenue.find({ userId }).sort({ periodValue: 1 });
//   console.log("Revenues:", revenues);

//   // 2️⃣ Fetch historical monthly expenses
//   const expenses = await ExpenseInput.find({ userId }).sort({ periodValue: 1 });
//   console.log("Expenses:", expenses);

//   // 3️⃣ Fetch current cash position
//   const financials = await BusinessFinancial.findOne({ userId });
//   console.log("Financials:", financials);

//   if (!financials) {
//     throw new ApiError(404, "Business financials not found");
//   }

//   // 4️⃣ Extract numeric series - FIXED FIELD NAMES
//   const revenueValues = revenues
//     .map(r => {
//       // Check multiple possible field names for revenue
//       return r.revenue || r.totalRevenue || r.monthlyRevenue || 0;
//     })
//     .filter(v => v > 0);

//   const expenseValues = expenses
//     .map(e => calculateTotalExpenses(e))
//     .filter(v => v > 0);

//   // FIXED: Use bankBalance instead of cashBalance
//   const currentCash = financials.bankBalance || financials.cash || 0;

//   console.log("Revenue Values:", revenueValues);
//   console.log("Expense Values:", expenseValues);
//   console.log("Current Cash:", currentCash);

//   if (revenueValues.length === 0 && expenseValues.length === 0) {
//     throw new ApiError(400, "Insufficient historical data for forecast");
//   }

//   // 5️⃣ Compute baseline stats
//   const revenueStats = calculateTrend(revenueValues);
//   const expenseStats = calculateTrend(expenseValues);

//   // Handle cases where we have no expense data
//   const avgExpenses = expenseStats.avg > 0 
//     ? expenseStats.avg 
//     : (financials.operatingExpenses || 0) / 12; // Fallback to annual operating expenses

//   // 6️⃣ Generate 3-month forecasts
//   const forecasts = [];
//   let runningCash = currentCash;

//   for (let month = 1; month <= 3; month++) {
//     const projectedRevenue = revenueStats.avg * Math.pow(1 + revenueStats.growthRate, month);
//     const projectedExpenses = avgExpenses * Math.pow(1 + expenseStats.growthRate, month);
//     const projectedCashFlow = projectedRevenue - projectedExpenses;

//     // Cash scenarios for this month
//     const cashScenarios = {
//       pessimistic: runningCash + projectedCashFlow * 0.6,
//       expected: runningCash + projectedCashFlow,
//       optimistic: runningCash + projectedCashFlow * 1.4
//     };

//     forecasts.push({
//       month,
//       revenue: Math.round(projectedRevenue),
//       expenses: Math.round(projectedExpenses),
//       cashFlow: Math.round(projectedCashFlow),
//       cashScenarios: {
//         pessimistic: Math.round(cashScenarios.pessimistic),
//         expected: Math.round(cashScenarios.expected),
//         optimistic: Math.round(cashScenarios.optimistic)
//       }
//     });

//     // Update running cash for next month (use expected scenario)
//     runningCash = cashScenarios.expected;
//   }

//   // 7️⃣ Ask AI to interpret + explain
//   const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

//   const prompt = `
// You are a financial forecasting AI.

// Historical Data:
// - Average monthly revenue: $${Math.round(revenueStats.avg).toLocaleString()}
// - Revenue growth rate: ${(revenueStats.growthRate * 100).toFixed(2)}%
// - Average monthly expenses: $${Math.round(avgExpenses).toLocaleString()}
// - Expense growth rate: ${(expenseStats.growthRate * 100).toFixed(2)}%
// - Current cash balance: $${currentCash.toLocaleString()}
// - Historical revenue data points: ${revenueValues.length}
// - Historical expense data points: ${expenseValues.length}

// 3-Month Forecast:
// ${forecasts.map(f => `
// Month ${f.month}:
//   - Revenue: $${f.revenue.toLocaleString()}
//   - Expenses: $${f.expenses.toLocaleString()}
//   - Cash Flow: $${f.cashFlow.toLocaleString()}
//   - Expected Cash Position: $${f.cashScenarios.expected.toLocaleString()}
// `).join('\n')}

// Tasks:
// 1. Provide a concise executive summary of the 3-month forecast
// 2. Identify key trends and potential risks
// 3. Explain the pessimistic, expected, and optimistic scenarios
// 4. Provide 2-3 actionable recommendations
// 5. Keep explanations professional and finance-grade (max 300 words)
// `;

//   const aiResponse = await model.generateContent(prompt);
//   const aiInsight = aiResponse.response.text();

//   // 8️⃣ Final response
//   return {
//     currentFinancials: {
//       cashBalance: Math.round(currentCash),
//       avgMonthlyRevenue: Math.round(revenueStats.avg),
//       avgMonthlyExpenses: Math.round(avgExpenses),
//       revenueGrowthRate: `${(revenueStats.growthRate * 100).toFixed(2)}%`,
//       expenseGrowthRate: `${(expenseStats.growthRate * 100).toFixed(2)}%`
//     },
//     threeMonthForecast: forecasts,
//     aiInsight
//   };
// };


import { Revenue } from "../models/revenueInput.model.js"
import { ExpenseInput } from "../models/expenseInput.model.js";
import { BusinessFinancial } from "../models/businessFinancial.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Trends and avg
const calculateTrend = (values) => {
  if (!Array.isArray(values) || values.length < 2) {
    return { avg: 0, growthRate: 0 };
  }

  // Remove invalid numbers
  const cleanValues = values.filter(
    v => typeof v === "number" && !isNaN(v) && v > 0
  );

  if (cleanValues.length < 2) {
    return { avg: 0, growthRate: 0 };
  }

  const avg = cleanValues.reduce((a, b) => a + b, 0) / cleanValues.length;
  const first = cleanValues[0];
  const last = cleanValues[cleanValues.length - 1];
  const growthRate = first === 0 ? 0 : (last - first) / first;

  return { avg, growthRate };
};

// Helper to calculate total expenses from expense object
const calculateTotalExpenses = (expense) => {
  return (
    (expense.operatingExpenses || 0) +
    (expense.rentAndUtilities || 0) +
    (expense.payroll || 0) +
    (expense.marketingSpend || 0) +
    (expense.inventoryPurchases || 0) +
    (expense.loanInstallments || 0) +
    (expense.taxPayments || 0)
  );
};

export const generateFinancialForecastService = async ({ userId }) => {
  // 1️⃣ Fetch historical monthly revenue
  const revenues = await Revenue.find({ userId }).sort({ periodValue: 1 });
  console.log("Revenues found:", revenues.length);

  // 2️⃣ Fetch historical monthly expenses
  const expenses = await ExpenseInput.find({ userId }).sort({ periodValue: 1 });
  console.log("Expenses found:", expenses.length);

  // 3️⃣ Fetch current cash position
  const financials = await BusinessFinancial.findOne({ userId });

  if (!financials) {
    throw new ApiError(404, "Business financials not found");
  }

  // 4️⃣ Extract numeric series using CORRECT field names
  // Revenue model has 'monthlyRevenue' field
  const revenueValues = revenues
    .map(r => r.monthlyRevenue)
    .filter(v => typeof v === 'number' && v > 0);

  // ExpenseInput needs calculation of all expense fields
  const expenseValues = expenses
    .map(e => calculateTotalExpenses(e))
    .filter(v => v > 0);

  // BusinessFinancial has 'bankBalance' field (also has 'cash' as backup)
  const currentCash = financials.bankBalance || financials.cash || 0;

  console.log("Revenue Values:", revenueValues);
  console.log("Expense Values:", expenseValues);
  console.log("Current Cash:", currentCash);

  // Check if we have sufficient data
  if (revenueValues.length === 0 && expenseValues.length === 0) {
    throw new ApiError(400, "Insufficient historical data for forecast. Please add revenue and expense data.");
  }

  // 5️⃣ Compute baseline stats
  const revenueStats = calculateTrend(revenueValues);
  const expenseStats = calculateTrend(expenseValues);

  // Fallback to annual operating expenses divided by 12 if no monthly expense data
  const avgExpenses = expenseStats.avg > 0 
    ? expenseStats.avg 
    : (financials.operatingExpenses || 0) / 12;

  // If still no expense data, use a percentage of revenue as estimate
  const finalAvgExpenses = avgExpenses > 0 
    ? avgExpenses 
    : revenueStats.avg * 0.7; // Default to 70% of revenue

  console.log("Revenue Stats:", revenueStats);
  console.log("Expense Stats:", expenseStats);
  console.log("Final Avg Expenses:", finalAvgExpenses);

  // 6️⃣ Generate 3-month forecasts
  const forecasts = [];
  let runningCash = currentCash;

  for (let month = 1; month <= 3; month++) {
    // Apply compound growth for each month
    const projectedRevenue = revenueStats.avg * Math.pow(1 + revenueStats.growthRate, month);
    const projectedExpenses = finalAvgExpenses * Math.pow(1 + expenseStats.growthRate, month);
    const projectedCashFlow = projectedRevenue - projectedExpenses;

    // Cash scenarios for this month
    const cashScenarios = {
      pessimistic: runningCash + projectedCashFlow * 0.6,
      expected: runningCash + projectedCashFlow,
      optimistic: runningCash + projectedCashFlow * 1.4
    };

    forecasts.push({
      month,
      revenue: Math.round(projectedRevenue),
      expenses: Math.round(projectedExpenses),
      cashFlow: Math.round(projectedCashFlow),
      cashScenarios: {
        pessimistic: Math.round(cashScenarios.pessimistic),
        expected: Math.round(cashScenarios.expected),
        optimistic: Math.round(cashScenarios.optimistic)
      }
    });

    // Update running cash for next month (use expected scenario)
    runningCash = cashScenarios.expected;
  }

  // 7️⃣ Ask AI to interpret + explain
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

  const prompt = `
You are a financial forecasting AI.

Historical Data:
- Average monthly revenue: $${Math.round(revenueStats.avg).toLocaleString()}
- Revenue growth rate: ${(revenueStats.growthRate * 100).toFixed(2)}%
- Average monthly expenses: $${Math.round(finalAvgExpenses).toLocaleString()}
- Expense growth rate: ${(expenseStats.growthRate * 100).toFixed(2)}%
- Current cash balance: $${currentCash.toLocaleString()}
- Historical revenue data points: ${revenueValues.length}
- Historical expense data points: ${expenseValues.length}

3-Month Forecast:
${forecasts.map(f => `
Month ${f.month}:
  - Revenue: $${f.revenue.toLocaleString()}
  - Expenses: $${f.expenses.toLocaleString()}
  - Cash Flow: $${f.cashFlow.toLocaleString()}
  - Expected Cash Position: $${f.cashScenarios.expected.toLocaleString()}
`).join('\n')}

Tasks:
1. Provide a concise executive summary of the 3-month forecast
2. Identify key trends and potential risks
3. Explain the pessimistic, expected, and optimistic scenarios
4. Provide 2-3 actionable recommendations
5. Keep explanations professional and finance-grade (max 300 words)
`;

  const aiResponse = await model.generateContent(prompt);
  const aiInsight = aiResponse.response.text();

  // 8️⃣ Final response
  return {
    currentFinancials: {
      cashBalance: Math.round(currentCash),
      avgMonthlyRevenue: Math.round(revenueStats.avg),
      avgMonthlyExpenses: Math.round(finalAvgExpenses),
      revenueGrowthRate: `${(revenueStats.growthRate * 100).toFixed(2)}%`,
      expenseGrowthRate: `${(expenseStats.growthRate * 100).toFixed(2)}%`,
      dataQuality: {
        revenueDataPoints: revenueValues.length,
        expenseDataPoints: expenseValues.length
      }
    },
    threeMonthForecast: forecasts,
    aiInsight
  };
};