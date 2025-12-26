import { Revenue } from "../models/revenueInput.model.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const saveRevenueService = async ({
  userId,
  periodValue,
  monthlyRevenue,
  salesChannel,
  topProductsServices,
  averageSellingPrice,
  seasonalPattern,
  creditSalesPercentage
}) => {
  if (!periodValue) {
    throw new ApiError(400, "Month is required");
  }

  const revenue = await Revenue.findOneAndUpdate(
    { userId, periodValue },
    {
      monthlyRevenue,
      salesChannel,
      topProductsServices,
      averageSellingPrice,
      seasonalPattern,
      creditSalesPercentage
    },
    { new: true, upsert: true }
  );

  return revenue;
};

export const getRevenueService = async ({ userId, periodValue }) => {
  if (!periodValue) {
    throw new ApiError(400, "Month is required");
  }

  const revenue = await Revenue.findOne({ userId, periodValue });

  if (!revenue) {
    throw new ApiError(404, "Revenue data not found");
  }

  return revenue;
};
