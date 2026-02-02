import mongoose from "mongoose";

const expenseInputSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /**
     * Locked to monthly
     * Format: YYYY-MM
     */
    periodValue: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/ // validates YYYY-MM
    },

    operatingExpenses: { type: Number, default: 0 },
    rentAndUtilities: { type: Number, default: 0 },
    payroll: { type: Number, default: 0 },
    marketingSpend: { type: Number, default: 0 },
    inventoryPurchases: { type: Number, default: 0 },
    loanInstallments: { type: Number, default: 0 },
    taxPayments: { type: Number, default: 0 }
  },
  { timestamps: true }
);

/**
 * One expense record per user per month
 */
expenseInputSchema.index(
  { userId: 1, periodValue: 1 },
  { unique: true }
);

export const ExpenseInput = mongoose.model(
  "ExpenseInput",
  expenseInputSchema
);
