import { User } from "../models/user.model.js";
import { BusinessProfile } from "../models/businessProfile.model.js";
import { DailyHistory } from "../models/dailyHistory.model.js";

export const dashboardKpi = async () => {

  /* ---------------- PLATFORM KPIs ---------------- */
  const totalUsers = await User.countDocuments();
  const totalBusinesses = await BusinessProfile.countDocuments();

  /* ---------------- FINANCIAL AGGREGATION ---------------- */
  const financialAgg = await DailyHistory.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$revenue" },
        totalExpenses: { $sum: "$expenses" },
        avgCash: { $avg: "$cashBalance" },
        avgPayables: { $avg: "$payables" }
      }
    }
  ]);

  const finance = financialAgg[0] || {
    totalRevenue: 0,
    totalExpenses: 0,
    avgCash: 0,
    avgPayables: 0
  };

  const netProfit =
    finance.totalRevenue - finance.totalExpenses;

  /* ---------------- RATIOS ---------------- */
  const profitabilityRatio =
    finance.totalRevenue > 0
      ? (netProfit / finance.totalRevenue) * 100
      : 0;

  const liquidityRatio =
    finance.avgPayables > 0
      ? finance.avgCash / finance.avgPayables
      : 0;

  /* ---------------- CASHFLOW TREND ---------------- */
  const cashflowHistory = await DailyHistory
    .find({})
    .sort({ date: -1 })
    .limit(2)
    .select("cashBalance");

  const cashflowTrend =
    cashflowHistory.length === 2
      ? cashflowHistory[0].cashBalance -
        cashflowHistory[1].cashBalance
      : 0;

  /* ---------------- 6-MONTH CHART DATA ---------------- */
  const monthlyTrend = await DailyHistory.aggregate([
    {
      $group: {
        _id: { $month: "$date" },
        revenue: { $sum: "$revenue" },
        expenses: { $sum: "$expenses" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  /* ---------------- FINAL KPI RESPONSE ---------------- */
  return {
    users: {
      total: totalUsers
    },
    businesses: {
      total: totalBusinesses
    },
    finance: {
      revenue: finance.totalRevenue,
      expenses: finance.totalExpenses,
      netProfit
    },
    ratios: {
      profitabilityRatio: Number(profitabilityRatio.toFixed(1)),
      liquidityRatio: Number(liquidityRatio.toFixed(2))
    },
    cashflow: {
      trend: cashflowTrend,
      status: cashflowTrend >= 0 ? "Positive" : "Negative"
    },
    chart: {
      revenueVsExpenses: monthlyTrend
    }
  };
};
