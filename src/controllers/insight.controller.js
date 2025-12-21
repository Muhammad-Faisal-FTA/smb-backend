import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { generateAIInsightsService } from "../services/insights.service.js";

export const generateInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;
   const { periodType, startDate, endDate } = req.body;

  if (!periodType) {
    throw new ApiError(400, "periodType is required");
  }

  const insights = await generateAIInsightsService({
    userId,
    periodType,
    startDate,
    endDate
  });
    
  res.status(200).json(
    new ApiResponse(200, insights, "AI insights generated successfully")
  );
});
