import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {
  saveAssetsLiabilitiesService,
  getAssetsLiabilitiesService
} from "../services/assetsLiabilities.service.js";

export const saveAssetsLiabilitiesCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue, ...data } = req.body;

  const result = await saveAssetsLiabilitiesService({
    userId,
    periodValue,
    ...data
  });

  res.status(200).json(
    new ApiResponse(200, result, "Assets & liabilities saved")
  );
});

export const getAssetsLiabilitiesCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { periodValue } = req.query;

  const result = await getAssetsLiabilitiesService({
    userId,
    periodValue
  });

  res.status(200).json(
    new ApiResponse(200, result, "Assets & liabilities fetched")
  );
});
