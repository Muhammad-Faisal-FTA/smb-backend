import { transporter } from '../emails/Email.config.js';
import { BusinessProfile } from '../models/businessProfile.model.js';
import { BusinessFinancial } from '../models/businessFinancial.model.js';

/* ---------------- HELPER FUNCTIONS ---------------- */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

/* ---------------- GATHER REPORT DATA ---------------- */
export const gatherReportData = async (userId) => {
  const businessProfile = await BusinessProfile.findOne({ userId }).lean();
  if (!businessProfile) {
    throw new Error('Business profile not found');
  }

  const currentFinancial = await BusinessFinancial
    .findOne({ userId })
    .sort({ periodEnd: -1 })
    .lean();

  if (!currentFinancial) {
    throw new Error('Financial data not found');
  }

  const previousFinancial = await BusinessFinancial
    .findOne({ 
      userId,
      periodEnd: { $lt: currentFinancial.periodEnd }
    })
    .sort({ periodEnd: -1 })
    .lean();

  const totalExpenses = currentFinancial.operatingExpenses + currentFinancial.cogs;
  const prevTotalExpenses = previousFinancial 
    ? previousFinancial.operatingExpenses + previousFinancial.cogs 
    : 0;

  const currentAssets = 
    currentFinancial.cash + 
    currentFinancial.bankBalance + 
    currentFinancial.accountsReceivable + 
    currentFinancial.inventory + 
    currentFinancial.currentAssetsOther;

  const metrics = {
    revenue: currentFinancial.revenue,
    revenueChange: previousFinancial 
      ? calculatePercentageChange(currentFinancial.revenue, previousFinancial.revenue)
      : 0,
    expenses: totalExpenses,
    expensesChange: previousFinancial
      ? calculatePercentageChange(totalExpenses, prevTotalExpenses)
      : 0,
    netProfit: currentFinancial.netProfit,
    profitChange: previousFinancial
      ? calculatePercentageChange(currentFinancial.netProfit, previousFinancial.netProfit)
      : 0,
    profitMargin: currentFinancial.revenue > 0 
      ? (currentFinancial.netProfit / currentFinancial.revenue) * 100 
      : 0,
    liquidityRatio: currentFinancial.currentLiabilities > 0 
      ? currentAssets / currentFinancial.currentLiabilities 
      : 0,
    debtToEquityRatio: currentFinancial.totalEquity > 0
      ? currentFinancial.totalDebt / currentFinancial.totalEquity
      : 0,
    cashBalance: currentFinancial.cash + currentFinancial.bankBalance,
    financialHealthScore: currentFinancial.financialHealthScore || 0
  };

  return {
    businessProfile,
    metrics,
    period: {
      start: currentFinancial.periodStart,
      end: currentFinancial.periodEnd
    }
  };
};

/* ---------------- SIMPLE EMAIL TEMPLATE ---------------- */
export const generateEmailTemplate = (data) => {
  const { businessProfile, metrics, period } = data;
  const currency = businessProfile.currency || 'USD';

  const getHealth = (score) => {
    if (score >= 80) return { color: '#10b981', text: 'Excellent' };
    if (score >= 60) return { color: '#3b82f6', text: 'Good' };
    if (score >= 40) return { color: '#f59e0b', text: 'Fair' };
    return { color: '#ef4444', text: 'Needs Attention' };
  };

  const health = getHealth(metrics.financialHealthScore);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
.container{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden}
.header{background:#667eea;color:#fff;padding:30px;text-align:center}
.content{padding:20px}
.metric{background:#f9fafb;padding:15px;margin:10px 0;border-radius:6px}
.footer{background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#666}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>📊 Financial Report</h1>
<p>${businessProfile.businessName}</p>
<p style="color:${health.color}">Health: ${health.text} (${metrics.financialHealthScore.toFixed(0)}/100)</p>
</div>
<div class="content">
<p><strong>Period:</strong> ${formatDate(period.start)} - ${formatDate(period.end)}</p>

<div class="metric">
<strong>Revenue:</strong> ${formatCurrency(metrics.revenue, currency)}<br>
<small>Change: ${metrics.revenueChange.toFixed(1)}%</small>
</div>

<div class="metric">
<strong>Expenses:</strong> ${formatCurrency(metrics.expenses, currency)}<br>
<small>Change: ${metrics.expensesChange.toFixed(1)}%</small>
</div>

<div class="metric">
<strong>Net Profit:</strong> ${formatCurrency(metrics.netProfit, currency)}<br>
<small>Margin: ${metrics.profitMargin.toFixed(1)}%</small>
</div>

<div class="metric">
<strong>Cash Balance:</strong> ${formatCurrency(metrics.cashBalance, currency)}
</div>

<div class="metric">
<strong>Liquidity Ratio:</strong> ${metrics.liquidityRatio.toFixed(2)}<br>
<strong>Debt-to-Equity:</strong> ${metrics.debtToEquityRatio.toFixed(2)}
</div>

</div>
<div class="footer">
<p>${businessProfile.businessName} - ${formatDate(new Date())}</p>
</div>
</div>
</body>
</html>`;
};

/* ---------------- SEND SINGLE REPORT ---------------- */
export const sendFinancialReport = async (userId, recipientEmail = null) => {
  try {
    const reportData = await gatherReportData(userId);
    const toEmail = recipientEmail || reportData.businessProfile.adminEmail;
    const htmlContent = generateEmailTemplate(reportData);
    
    const mailOptions = {
      from: `"Finance Pulse" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Financial Report - ${reportData.businessProfile.businessName}`,
      html: htmlContent,
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId,
      recipient: toEmail
    };
    
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
};

/* ---------------- SEND TO MULTIPLE USERS ---------------- */
export const sendBulkReports = async (userIds) => {
  let successful = 0;
  let failed = 0;

  console.log(`Sending reports to ${userIds.length} users...`);

  for (const userId of userIds) {
    try {
      await sendFinancialReport(userId);
      successful++;
      console.log(`✅ Sent to user ${userId}`);
      
      // Wait 3 seconds between emails
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      failed++;
      console.error(`❌ Failed for user ${userId}:`, error.message);
    }
  }

  console.log(`✅ Monthly reports sent: ${successful} successful, ${failed} failed`);
  return { successful, failed };
};