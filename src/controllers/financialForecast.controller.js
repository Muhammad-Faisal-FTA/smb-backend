import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { generateFinancialForecastService } from "../services/financialForecast.service.js";

export const generateFinancialForecastCtrl = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await generateFinancialForecastService({ userId });

  res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Financial forecast generated successfully"
    )
  );
});
