import { ExpenseInput } from "../models/expenseInput.model.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const saveMonthlyExpenseService = async ({
  userId,
  periodValue,
  ...expenseData
}) => {
  if (!userId || !periodValue) {
    throw new ApiError(400, "Month (YYYY-MM) is required");
  }

  const expense = await ExpenseInput.findOneAndUpdate(
    { userId, periodValue },
    { $set: expenseData },
    { new: true, upsert: true }
  );

  return expense;
};

export const getMonthlyExpenseService = async ({
  userId,
  periodValue
}) => {
  const expense = await ExpenseInput.findOne({
    userId,
    periodValue
  });

  if (!expense) {
    throw new ApiError(404, "Monthly expense not found");
  }

  return expense;
};
