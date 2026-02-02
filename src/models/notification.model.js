import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["CRITICAL", "WARNING", "INFO"],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    category: {
      type: String, // Cashflow, Expenses, Reports, AI, System
      index: true
    },

    isRead: {
      type: Boolean,
      default: false
    },

    metadata: {
      type: Object // amounts, thresholds, % change, etc.
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model(
  "Notification",
  notificationSchema
);
