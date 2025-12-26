import { AssetsLiabilities } from "../models/assetsLiabilities.model.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const saveAssetsLiabilitiesService = async ({
  userId,
  periodValue,
  ...data
}) => {
  if (!userId || !periodValue) {
    throw new ApiError(400, "Month is required");
  }

  return await AssetsLiabilities.findOneAndUpdate(
    { userId, periodValue },
    { $set: data },
    { new: true, upsert: true }
  );
};

export const getAssetsLiabilitiesService = async ({
  userId,
  periodValue
}) => {
  const record = await AssetsLiabilities.findOne({ userId, periodValue });

  if (!record) {
    throw new ApiError(404, "Assets & liabilities not found");
  }

  return record;
};
