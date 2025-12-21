import mongoose , {Schema} from "mongoose"

const monthlyHistorySchema = new Schema({
  // Stores as the first day of the month (e.g., 2025-01-01)
  month: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },
  // Income Statement Metrics
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  grossProfit: {
    type: Number,
    required: true
  },
  netProfit: {
    type: Number,
    required: true
  },
  ebitda: {
    type: Number, // Earnings Before Interest, Taxes, Depreciation, and Amortization
    required: true
  },
  // Balance Sheet Metrics
  totalDebt: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEquity: {
    type: Number,
    required: true
  },
  currentAssets: {
    type: Number,
    required: true,
    min: 0
  },
  currentLiabilities: {
    type: Number,
    required: true,
    min: 0
  },
  // Cash Flow / Runway Metrics
  burnRate: {
    type: Number, // Negative if cash flow is positive, positive if losing cash
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Virtual: Current Ratio
 * Formula: Current Assets / Current Liabilities
 * Measures the company's ability to pay short-term obligations.
 */
// monthlyHistorySchema.virtual('currentRatio').get(function() {
//   return this.currentLiabilities > 0 ? (this.currentAssets / this.currentLiabilities).toFixed(2) : 0;
// });

/**
 * Virtual: Debt-to-Equity Ratio
 */
// monthlyHistorySchema.virtual('debtToEquity').get(function() {
//   return this.totalEquity !== 0 ? (this.totalDebt / this.totalEquity).toFixed(2) : 0;
// });

export const MonthlyHistory = mongoose.model('MonthlyHistory', monthlyHistorySchema);

