import mongoose from "mongoose";

const vendorPayablesSchema = new mongoose.Schema(
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

    totalVendors: { type: Number, default: 0 },
    payablesAgingDays: { type: Number, default: 0 },
    averagePurchaseValue: { type: Number, default: 0 },

    paymentTerms: {
      type: String,
      enum: ["Immediate", "15 Days", "30 Days", "45 Days", "60 Days"]
    },

    advancePaymentsPercentage: { type: Number, default: 0 },
    earlyPaymentDiscountPercentage: { type: Number, default: 0 }
  },
  { timestamps: true }
);

vendorPayablesSchema.index(
  { userId: 1, periodValue: 1 },
  { unique: true }
);

export const VendorPayables = mongoose.model(
  "VendorPayables",
  vendorPayablesSchema
);
