import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    periodValue: {
      type: String, // YYYY-MM
      required: true
    },

    monthlyRevenue: {
      type: Number,
      required: true,
      min: 0
    },

    salesChannel: {
      type: String,
      required: true
    },

    topProductsServices: {
      type: String,
      required: true
    },

    averageSellingPrice: {
      type: Number,
      required: true,
      min: 0
    },

    seasonalPattern: {
      type: String,
      required: true
    },

    creditSalesPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  { timestamps: true }
);

revenueSchema.index({ userId: 1, periodValue: 1 }, { unique: true });

export const Revenue = mongoose.model("Revenue", revenueSchema);
