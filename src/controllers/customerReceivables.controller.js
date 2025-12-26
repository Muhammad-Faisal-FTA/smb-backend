import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {
  saveCustomerReceivablesService,
  getCustomerReceivablesService
} from "../services/customerReceivables.service.js";

/**
 * SAVE / UPDATE
 * POST /customer-receivables/monthly
 */
export const saveCustomerReceivablesCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue, ...data } = req.body;

  const result = await saveCustomerReceivablesService({
    userId,
    periodValue,
    ...data
  });

  res.status(200).json(
    new ApiResponse(200, result, "Customer receivables saved successfully")
  );
});

/**
 * GET
 * GET /customer-receivables/monthly?periodValue=YYYY-MM
 */
export const getCustomerReceivablesCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue } = req.query;

  const result = await getCustomerReceivablesService({
    userId,
    periodValue
  });

  res.status(200).json(
    new ApiResponse(200, result, "Customer receivables fetched successfully")
  );
});
