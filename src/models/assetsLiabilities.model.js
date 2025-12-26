import mongoose from "mongoose";

const assetsLiabilitiesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    periodValue: {
      type: String, // YYYY-MM
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/
    },

    cashOnHand: { type: Number, default: 0 },
    bankBalance: { type: Number, default: 0 },
    accountsReceivable: { type: Number, default: 0 },
    inventoryValue: { type: Number, default: 0 },
    currentLiabilities: { type: Number, default: 0 },
    longTermDebt: { type: Number, default: 0 },
    vendorPayables: { type: Number, default: 0 }
  },
  { timestamps: true }
);

assetsLiabilitiesSchema.index(
  { userId: 1, periodValue: 1 },
  { unique: true }
);

export const AssetsLiabilities = mongoose.model(
  "AssetsLiabilities",
  assetsLiabilitiesSchema
);
