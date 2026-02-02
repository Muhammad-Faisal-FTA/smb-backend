import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {
  saveVendorPayablesService,
  getVendorPayablesService
} from "../services/vendorPayables.service.js";

/**
 * Save or update monthly vendor & payables data
 */
export const saveVendorPayablesCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue, ...data } = req.body;

  const result = await saveVendorPayablesService({
    userId,
    periodValue,
    ...data
  });

  res.status(200).json(
    new ApiResponse(200, result, "Vendor & payables saved successfully")
  );
});

/**
 * Fetch monthly vendor & payables data
 */
export const getVendorPayablesCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue } = req.query;
  console.log("periodValue",periodValue)
  const result = await getVendorPayablesService({
    userId,
    periodValue
  });

  res.status(200).json(
    new ApiResponse(200, result, "Vendor & payables fetched successfully")
  );
});
