import { DailyHistory } from "../models/dailyHistory.model.js";
// import { ApiError } from "../utils/ApiError.utils.js";

/**
 * Record or update daily financial history
 * @param {Object} payload
 */
export const recordDailyHistoryService = async (payload) => {
  const {
    userId,
    date,
    revenue,
    expenses,
    cash,
    bankBalance,
    accountsReceivable,
    payables,
    inventory,
  } = payload;

  // 1. Normalize Date
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  // 2. Perform the Update
  const dailyRecord = await DailyHistory.findOneAndUpdate(
    { 
      userId: userId, 
      "financialData.date": normalizedDate 
    },
    {
      $set: {
        userId,
        financialData: {
          date: normalizedDate,
          // Explicitly map each field to ensure they aren't saved as 0 or undefined
          revenue: Number(revenue) || 0,
          expenses: Number(expenses) || 0,
          cash: Number(cash) || 0,
          bankBalance: Number(bankBalance) || 0,
          accountsReceivable: Number(accountsReceivable) || 0,
          payables: Number(payables) || 0,
          inventory: Number(inventory) || 0
        },
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return dailyRecord;
};