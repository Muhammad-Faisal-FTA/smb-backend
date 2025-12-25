// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { ApiError } from "../utils/ApiError.utils.js";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// //  Generate AI insights using Google Gemini
 
// export const generateAIInsightsService = async ({
//   userId,
//   periodType, // daily | weekly | monthly
//   financialData
// }) => {
//   if (!userId || !periodType || !financialData) {
//     throw new ApiError(400, "Missing required parameters for AI insights");

//   }
 
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash-lite"
//   });

//   const prompt = buildInsightPrompt(periodType, financialData);

//   try {
//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();
//     // const cleanedJson = cleanJsonResponse(responseText);

//     // return JSON.parse(responseText);
//     console.log(responseText);
//     return responseText;
//   } catch (error) {
//     console.error("Gemini Insight Error:", error);
//     throw new ApiError(500, "Failed to generate AI insights");
//   }
// };

// const buildInsightPrompt = (periodType, data) => {
//   return `
// You are a senior financial analyst AI.

// Analyze the following ${periodType} financial data and generate insights.

// Rules:
// - Be concise and professional
// - Detect risks, trends, and opportunities
// - Return ONLY valid JSON
// - Do not add explanations outside JSON

// Financial Data:
// ${JSON.stringify(data, null, 2)}

// Return JSON in this exact format:
// {
//   "period": "${periodType}",
//   "overallHealth": "Excellent | Good | Moderate | Risky | Critical",
//   "insights": [
//     {
//       "type": "positive | warning | critical | recommendation",
//       "message": "Insight text here"
//     }
//   ]
// }
// `;
// };


import { DailyHistory } from "../models/dailyHistory.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIInsightsService = async ({
  userId,
  periodType,
  startDate,
  endDate
}) => {
 
  if (!userId || !periodType || !startDate || !endDate) {
    throw new ApiError(400, "Missing required insight parameters");
  }

  // 1️⃣ Fetch historical data
const history = await DailyHistory.find({
  userId,
  periodType,
  "financialData.date": {
    $gte: startDate,
    $lte: endDate
  }
});
  //  const history = [
  //   {
  //     _id: "test_id_1",
  //     userId: userId,
  //     financialData: {
  //       date: new Date("2025-01-10"),
  //       revenue: 15000,
  //       expenses: 8000,
  //       cash: 6000,
  //       bankBalance: 50000,
  //       accountsReceivable: 4000,
  //       payables: 3000,
  //       inventory: 20000
  //     },
  //     __v: 0
  //   },
  //   {
  //     _id: "test_id_2",
  //     userId: userId,
  //     financialData: {
  //       date: new Date("2025-01-11"),
  //       revenue: 12000,
  //       expenses: 8500,
  //       cash: 5000,
  //       bankBalance: 45000,
  //       accountsReceivable: 3000,
  //       payables: 2500,
  //       inventory: 18000
  //     },
  //     __v: 0
  //   }
  // ];
  if (!history.length) {
    throw new ApiError(404, "No financial history found for this period");
  }

  // 2️⃣ Aggregate data
  const aggregated = aggregateFinancialData(history, periodType);

  // 3️⃣ Generate AI insights
  const aiInsights = await generateGeminiInsights(aggregated, periodType);

  return {
    periodType,
    summary: aggregated.summary,
    insights: aiInsights
  };
};
 
const aggregateFinancialData = (history, periodType) => {
  let revenue = 0;
  let expenses = 0;
  let cashTrend = [];
  let payablesTrend = [];

  history.forEach(h => {
    const f = h.financialData;
    revenue += f.revenue;
    expenses += f.expenses;
    cashTrend.push(f.cash + f.bankBalance);
    payablesTrend.push(f.payables);
  });

  const netProfit = revenue - expenses;

  return {
    summary: {
      periodType,
      revenue,
      expenses,
      netProfit,
      avgCash: avg(cashTrend),
      avgPayables: avg(payablesTrend),
      healthSignal: netProfit > 0 ? "Positive" : "Risk"
    },
    raw: history.map(h => h.financialData)
  };
};

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;


const generateGeminiInsights = async (data, periodType) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

const prompt = `
You are a senior financial analyst AI.

Analyze the following ${periodType} financial data and generate insights.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT add extra keys
- Do NOT nest objects incorrectly
- Do NOT repeat period or overallHealth inside insights
- insights MUST be an array
- Each insight MUST contain only: type, message
- Use clear financial reasoning
- Be concise and professional

Financial Data:
${JSON.stringify(data, null, 2)}

Return JSON in EXACTLY this structure:

{
  "period": "${periodType}",
  "overallHealth": "Excellent | Good | Moderate | Risky | Critical",
  "insights": [
    {
      "type": "positive | warning | critical | recommendation",
      "message": "Insight text here"
    }
  ],
  "summary": "One concise executive-level summary paragraph"
}
`;


    const result = await model.generateContent(prompt);
    console.log(result.response.text())
    const responseText = result.response.text();

// Remove markdown code blocks if present
const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();

return JSON.parse(cleanedText);  // Parse to actual JSON object

  } catch (error) {
    console.error("Gemini Insight Error:", error);
    throw new Error("Failed to generate AI insights");
  }
};
