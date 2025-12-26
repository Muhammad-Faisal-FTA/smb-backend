import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {
  saveRevenueService,
  getRevenueService
} from "../services/revenueInput.service.js";

export const saveRevenueCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await saveRevenueService({
    userId,
    ...req.body
  });

  res.status(200).json(
    new ApiResponse(200, result, "Revenue saved")
  );
});

export const getRevenueCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue } = req.query;

  const result = await getRevenueService({
    userId,
    periodValue
  });

  res.status(200).json(
    new ApiResponse(200, result, "Revenue fetched")
  );
});
