import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { recordDailyHistoryService } from "../services/dailyHistory.service.js";

export const recordDailyHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  const result = await recordDailyHistoryService({
    ...req.body,
    userId
});

  res.status(201).json(
    new ApiResponse(201, result, "Daily history recorded successfully")
  );
});
