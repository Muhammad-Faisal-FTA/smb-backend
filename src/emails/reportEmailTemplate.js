
/* ---------------- GENERATE HTML EMAIL TEMPLATE ---------------- */
export const generateEmailTemplate = (data) => {
  const { businessProfile, metrics, dailyAverages, period } = data;
  const currency = businessProfile.currency || 'USD';

  // Health Status Badge
  const getHealthBadge = (score) => {
    if (score >= 80) return { color: '#10b981', text: 'Excellent', emoji: '🌟' };
    if (score >= 60) return { color: '#3b82f6', text: 'Good', emoji: '👍' };
    if (score >= 40) return { color: '#f59e0b', text: 'Fair', emoji: '⚠️' };
    return { color: '#ef4444', text: 'Needs Attention', emoji: '🚨' };
  };

  const healthBadge = getHealthBadge(metrics.financialHealthScore);

  // Format trend indicator
  const getTrendIcon = (value) => {
    if (value > 0) return '📈';
    if (value < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (value, isExpense = false) => {
    if (isExpense) {
      return value > 0 ? '#ef4444' : '#10b981';
    }
    return value > 0 ? '#10b981' : '#ef4444';
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Financial Report - ${businessProfile.businessName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      background-color: #f4f4f4; 
    }
    .container { 
      max-width: 800px; 
      margin: 20px auto; 
      background: white; 
      border-radius: 8px; 
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header p { font-size: 16px; opacity: 0.9; }
    .health-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 10px 20px;
      border-radius: 25px;
      margin-top: 15px;
      font-size: 18px;
      font-weight: bold;
    }
    .content { padding: 30px; }
    .section { margin-bottom: 35px; }
    .section-title { 
      font-size: 20px; 
      color: #667eea; 
      margin-bottom: 20px; 
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
      font-weight: 600;
    }
    .metrics-grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 20px; 
      margin-bottom: 20px;
    }
    .metric-card { 
      background: #f9fafb; 
      padding: 20px; 
      border-radius: 8px; 
      border-left: 4px solid #667eea;
    }
    .metric-label { 
      font-size: 13px; 
      color: #6b7280; 
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .metric-value { 
      font-size: 26px; 
      font-weight: bold; 
      color: #1f2937; 
      margin-bottom: 5px;
    }
    .metric-change { 
      font-size: 14px; 
      font-weight: 500;
    }
    .info-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 12px 0; 
      border-bottom: 1px solid #e5e7eb;
    }
    .info-label { 
      color: #6b7280; 
      font-weight: 500;
    }
    .info-value { 
      font-weight: 600; 
      color: #1f2937;
    }
    .alert { 
      background: #fef3c7; 
      border-left: 4px solid #f59e0b; 
      padding: 15px; 
      margin: 15px 0; 
      border-radius: 4px;
    }
    .alert.success { 
      background: #d1fae5; 
      border-left-color: #10b981; 
    }
    .alert.danger { 
      background: #fee2e2; 
      border-left-color: #ef4444; 
    }
    .footer { 
      background: #f9fafb; 
      padding: 30px; 
      text-align: center; 
      color: #6b7280;
      font-size: 14px;
    }
    .footer a { 
      color: #667eea; 
      text-decoration: none; 
    }
    @media only screen and (max-width: 600px) {
      .metrics-grid { grid-template-columns: 1fr; }
      .content { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📊 Financial Report</h1>
      <p>${businessProfile.businessName}</p>
      <div class="health-badge" style="color: ${healthBadge.color};">
        ${healthBadge.emoji} Financial Health: ${healthBadge.text} (${metrics.financialHealthScore.toFixed(0)}/100)
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      
      <!-- Business Information -->
      <div class="section">
        <h2 class="section-title">📋 Business Information</h2>
        <div class="info-row">
          <span class="info-label">Business Type:</span>
          <span class="info-value">${businessProfile.businessType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Region:</span>
          <span class="info-value">${businessProfile.region}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Employees:</span>
          <span class="info-value">${businessProfile.employeesRange}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Operating Model:</span>
          <span class="info-value">${businessProfile.operatingModel}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Report Period:</span>
          <span class="info-value">${formatDate(period.start)} - ${formatDate(period.end)}</span>
        </div>
      </div>

      <!-- Key Financial Metrics -->
      <div class="section">
        <h2 class="section-title">💰 Key Financial Metrics</h2>
        <div class="metrics-grid">
          
          <div class="metric-card">
            <div class="metric-label">Total Revenue</div>
            <div class="metric-value">${formatCurrency(metrics.revenue, currency)}</div>
            <div class="metric-change" style="color: ${getTrendColor(metrics.revenueChange)};">
              ${getTrendIcon(metrics.revenueChange)} ${metrics.revenueChange.toFixed(1)}% vs last period
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Total Expenses</div>
            <div class="metric-value">${formatCurrency(metrics.expenses, currency)}</div>
            <div class="metric-change" style="color: ${getTrendColor(metrics.expensesChange, true)};">
              ${getTrendIcon(metrics.expensesChange)} ${metrics.expensesChange.toFixed(1)}% vs last period
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Net Profit</div>
            <div class="metric-value">${formatCurrency(metrics.netProfit, currency)}</div>
            <div class="metric-change" style="color: ${getTrendColor(metrics.profitChange)};">
              ${getTrendIcon(metrics.profitChange)} ${metrics.profitChange.toFixed(1)}% vs last period
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Profit Margin</div>
            <div class="metric-value">${metrics.profitMargin.toFixed(1)}%</div>
            <div class="metric-change" style="color: #6b7280;">
              Industry avg: 10-20%
            </div>
          </div>

        </div>
      </div>

      <!-- Cash Position -->
      <div class="section">
        <h2 class="section-title">💵 Cash Position</h2>
        <div class="info-row">
          <span class="info-label">Cash Balance:</span>
          <span class="info-value">${formatCurrency(metrics.cashBalance, currency)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Accounts Receivable:</span>
          <span class="info-value">${formatCurrency(metrics.accountsReceivable, currency)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Accounts Payable:</span>
          <span class="info-value">${formatCurrency(metrics.accountsPayable, currency)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Average Daily Revenue (30d):</span>
          <span class="info-value">${formatCurrency(dailyAverages.avgDailyRevenue, currency)}</span>
        </div>
      </div>

      <!-- Financial Ratios -->
      <div class="section">
        <h2 class="section-title">📊 Financial Ratios</h2>
        <div class="metrics-grid">
          
          <div class="metric-card">
            <div class="metric-label">Liquidity Ratio</div>
            <div class="metric-value">${metrics.liquidityRatio.toFixed(2)}</div>
            <div class="metric-change" style="color: ${metrics.liquidityRatio >= 1.5 ? '#10b981' : metrics.liquidityRatio >= 1 ? '#f59e0b' : '#ef4444'};">
              ${metrics.liquidityRatio >= 1.5 ? '✅ Healthy' : metrics.liquidityRatio >= 1 ? '⚠️ Adequate' : '🚨 Warning'}
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Debt-to-Equity</div>
            <div class="metric-value">${metrics.debtToEquityRatio.toFixed(2)}</div>
            <div class="metric-change" style="color: ${metrics.debtToEquityRatio <= 1 ? '#10b981' : metrics.debtToEquityRatio <= 2 ? '#f59e0b' : '#ef4444'};">
              ${metrics.debtToEquityRatio <= 1 ? '✅ Good' : metrics.debtToEquityRatio <= 2 ? '⚠️ Moderate' : '🚨 High'}
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Inventory Turnover</div>
            <div class="metric-value">${metrics.inventoryTurnover.toFixed(1)}x</div>
            <div class="metric-change" style="color: #6b7280;">
              Times per period
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">Interest Coverage</div>
            <div class="metric-value">${metrics.interestCoverageRatio.toFixed(1)}x</div>
            <div class="metric-change" style="color: ${metrics.interestCoverageRatio >= 2 ? '#10b981' : '#f59e0b'};">
              ${metrics.interestCoverageRatio >= 2 ? '✅ Strong' : '⚠️ Monitor'}
            </div>
          </div>

        </div>
      </div>

      <!-- Insights & Recommendations -->
      <div class="section">
        <h2 class="section-title">💡 Key Insights</h2>
        
        ${metrics.profitMargin >= 20 ? `
          <div class="alert success">
            <strong>🎉 Excellent Profitability!</strong><br>
            Your profit margin of ${metrics.profitMargin.toFixed(1)}% is well above industry average.
          </div>
        ` : metrics.profitMargin < 10 ? `
          <div class="alert danger">
            <strong>⚠️ Low Profit Margin</strong><br>
            Your profit margin of ${metrics.profitMargin.toFixed(1)}% is below industry average. Consider reviewing expenses.
          </div>
        ` : ''}

        ${metrics.liquidityRatio < 1 ? `
          <div class="alert danger">
            <strong>🚨 Cash Flow Alert</strong><br>
            Your liquidity ratio is ${metrics.liquidityRatio.toFixed(2)}. You may have difficulty covering short-term obligations.
          </div>
        ` : ''}

        ${metrics.revenueChange > 15 ? `
          <div class="alert success">
            <strong>📈 Strong Growth!</strong><br>
            Revenue increased by ${metrics.revenueChange.toFixed(1)}% compared to last period.
          </div>
        ` : ''}

        ${metrics.debtToEquityRatio > 2 ? `
          <div class="alert">
            <strong>⚠️ High Debt Level</strong><br>
            Your debt-to-equity ratio of ${metrics.debtToEquityRatio.toFixed(2)} indicates high leverage. Consider debt reduction strategies.
          </div>
        ` : ''}

      </div>

    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>${businessProfile.businessName}</strong></p>
      <p>Report generated on ${formatDate(new Date())}</p>
      <p style="margin-top: 15px;">
        Questions? Contact us at <a href="mailto:${businessProfile.adminEmail}">${businessProfile.adminEmail}</a>
      </p>
      <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
        This report is confidential and intended solely for the use of ${businessProfile.businessName}
      </p>
    </div>

  </div>
</body>
</html>
  `;
}