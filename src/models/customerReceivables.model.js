import mongoose from "mongoose";

const customerReceivablesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    periodValue: {
      type: String,
      required: true
    },

    totalCustomers: { type: Number, default: 0 },
    averageInvoiceSize: { type: Number, default: 0 },

    receivables0to30: { type: Number, default: 0 },
    receivables31to60: { type: Number, default: 0 },
    receivables60Plus: { type: Number, default: 0 },

    paymentTerms: {
      type: String,
      enum: ["Immediate", "15 Days", "30 Days", "45 Days", "60 Days"]
    },

    badDebtPercentage: { type: Number, default: 0 },
    repeatCustomerRate: { type: Number, default: 0 }
  },
  { timestamps: true }
);

customerReceivablesSchema.index(
  { userId: 1, periodValue: 1 },
  { unique: true }
);

export const CustomerReceivables = mongoose.model(
  "CustomerReceivables",
  customerReceivablesSchema
);
