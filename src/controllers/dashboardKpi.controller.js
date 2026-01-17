// import { asyncHandler } from "../utils/asyncHandler.utils.js";
// import { ApiResponse } from "../utils/ApiResponse.utils.js";
// import {dashboardKpi} from "../services/dashboardKips.service.js"

// export const dashboardKpiCtrl = asyncHandler(async(req, res) => {
//     const kpis = await dashboardKpi();

//     res.status(201).json(
//     new ApiResponse(201, kpis, "successfully")
//   );
// })


import {
  dashboardKpi,
  formatCurrency,
  formatPercentage
} from "../services/dashboardKips.service.js";

/* ---------------- CONTROLLER: Get Dashboard KPIs ---------------- */
export const getDashboardKpis = async (req, res) => {
  try {
    const userId = req.user._id; // injected by auth middleware
    const kpiData = await dashboardKpi(userId);

    /* ---------------- KPI CARDS ---------------- */
    const cards = [
      {
        id: "revenue",
        icon: "dollar",
        iconColor: "teal",
        title: formatCurrency(kpiData.revenue.value),
        label: kpiData.revenue.label,
        sublabel: kpiData.revenue.sublabel,
        change: formatPercentage(kpiData.revenue.change),
        trend: kpiData.revenue.changeType
      },
      {
        id: "expenses",
        icon: "trending-down",
        iconColor: "orange",
        title: formatCurrency(kpiData.expenses.value),
        label: kpiData.expenses.label,
        sublabel: kpiData.expenses.sublabel,
        change: formatPercentage(kpiData.expenses.change),
        trend: kpiData.expenses.changeType
      },
      {
        id: "profit",
        icon: "trending-up",
        iconColor: "green",
        title: formatCurrency(kpiData.profit.value),
        label: kpiData.profit.label,
        sublabel: kpiData.profit.sublabel,
        change: formatPercentage(kpiData.profit.change),
        trend: kpiData.profit.changeType
      },
      {
        id: "cashflow",
        icon: "wallet",
        iconColor: "teal",
        title: kpiData.cashflow.status,
        label: kpiData.cashflow.label,
        sublabel: kpiData.cashflow.sublabel,
        change: formatCurrency(kpiData.cashflow.value),
        trend: kpiData.cashflow.value >= 0 ? "increase" : "decrease"
      },
      {
        id: "profitability",
        icon: "pie-chart",
        iconColor: "teal",
        title: `${kpiData.profitability.value}%`,
        label: kpiData.profitability.label,
        sublabel: kpiData.profitability.sublabel,
        change: formatPercentage(kpiData.profitability.change),
        trend: kpiData.profitability.changeType
      },
      {
        id: "liquidity",
        icon: "droplet",
        iconColor:
          kpiData.liquidity.status === "healthy"
            ? "green"
            : kpiData.liquidity.status === "adequate"
            ? "yellow"
            : "red",
        title: kpiData.liquidity.value.toString(),
        label: kpiData.liquidity.label,
        sublabel: kpiData.liquidity.sublabel,
        change: kpiData.liquidity.change.toString(),
        trend: kpiData.liquidity.changeType,
        status: kpiData.liquidity.status
      }
    ];

    /* ---------------- CHARTS (LAST 6 MONTHS) ---------------- */

   /* ---------------- CHARTS (SAFE GUARD) ---------------- */

const monthlyData = Array.isArray(kpiData?.chart?.monthlyData)
  ? kpiData.chart.monthlyData
  : [];

/* Revenue vs Expenses (6 months) */
const revenueExpenseChart = monthlyData.map(item => ({
  month: item.month,
  revenue: item.revenue,
  expenses: item.expenses
}));

/* Net Cashflow (Revenue - Expenses) */
const cashflowChart = monthlyData.map(item => ({
  month: item.month,
  value: item.revenue - item.expenses
}));


    /* ---------------- FINAL RESPONSE ---------------- */
    return res.status(200).json({
      success: true,
      data: {
        userId: req.user._id,
        cards,
        charts: {
  revenueExpense: revenueExpenseChart,
  cashflow: cashflowChart
},
        period: kpiData.period
      },
      message: "Dashboard KPIs retrieved successfully"
    });

  } catch (error) {
    console.error("Dashboard KPI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve dashboard KPIs"
    });
  }
};



/* ---------------- EXAMPLE API RESPONSE ---------------- */
/*
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "revenue",
        "icon": "dollar",
        "iconColor": "teal",
        "title": "$124,580",
        "label": "Total Revenue",
        "sublabel": "vs last month",
        "change": "+12.5%",
        "trend": "increase"
      },
      {
        "id": "expenses",
        "icon": "trending-down",
        "iconColor": "orange",
        "title": "$78,340",
        "label": "Total Expenses",
        "sublabel": "vs last month",
        "change": "+8.2%",
        "trend": "increase"
      },
      {
        "id": "profit",
        "icon": "trending-up",
        "iconColor": "green",
        "title": "$46,240",
        "label": "Net Profit",
        "sublabel": "vs last month",
        "change": "+18.3%",
        "trend": "increase"
      },
      {
        "id": "cashflow",
        "icon": "wallet",
        "iconColor": "teal",
        "title": "Positive",
        "label": "Cashflow Trend",
        "sublabel": "this month",
        "change": "+$12,450",
        "trend": "increase"
      },
      {
        "id": "profitability",
        "icon": "pie-chart",
        "iconColor": "teal",
        "title": "37.1%",
        "label": "Profitability Ratio",
        "sublabel": "vs last month",
        "change": "+2.4%",
        "trend": "increase"
      },
      {
        "id": "liquidity",
        "icon": "droplet",
        "iconColor": "red",
        "title": "1.45",
        "label": "Liquidity Ratio",
        "sublabel": "vs last month",
        "change": "-0.12",
        "trend": "decrease",
        "status": "adequate"
      }
    ],
    "chart": [
      {
        "month": "Jul",
        "revenue": 95000,
        "expenses": 62000,
        "period": "2024-07-31T00:00:00.000Z"
      },
      {
        "month": "Aug",
        "revenue": 105000,
        "expenses": 68000,
        "period": "2024-08-31T00:00:00.000Z"
      }
      // ... more months
    ],
    "period": {
      "current": {
        "start": "2024-12-01T00:00:00.000Z",
        "end": "2024-12-31T00:00:00.000Z"
      },
      "previous": {
        "start": "2024-11-01T00:00:00.000Z",
        "end": "2024-11-30T00:00:00.000Z"
      }
    }
  },
  "message": "Dashboard KPIs retrieved successfully"
}
*/