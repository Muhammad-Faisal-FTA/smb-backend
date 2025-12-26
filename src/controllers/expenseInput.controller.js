import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {
  saveMonthlyExpenseService,
  getMonthlyExpenseService
} from "../services/expenseInput.service.js";

export const saveMonthlyExpenseCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue, ...expenseData } = req.body;

  const expense = await saveMonthlyExpenseService({
    userId,
    periodValue,
    ...expenseData
  });

  res.status(200).json(
    new ApiResponse(200, expense, "Monthly expense saved successfully")
  );
});

export const getMonthlyExpenseCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue } = req.query;

  const expense = await getMonthlyExpenseService({
    userId,
    periodValue
  });

  res.status(200).json(
    new ApiResponse(200, expense, "Monthly expense fetched successfully")
  );
});
