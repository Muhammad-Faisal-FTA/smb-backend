import { CustomerReceivables } from "../models/customerReceivables.model.js";
import { ApiError } from "../utils/ApiError.utils.js";

/**
 * Save or update monthly customer & receivables data
 */
export const saveCustomerReceivablesService = async ({
  userId,
  periodValue,
  ...data
}) => {
  if (!userId || !periodValue) {
    throw new ApiError(400, "Month (YYYY-MM) is required");
  }

  return await CustomerReceivables.findOneAndUpdate(
    { userId, periodValue },
    { $set: data },
    { new: true, upsert: true }
  );
};

/**
 * Get monthly customer & receivables data
 */
export const getCustomerReceivablesService = async ({
  userId,
  periodValue
}) => {
  const record = await CustomerReceivables.findOne({
    userId,
    periodValue
  });

  if (!record) {
    throw new ApiError(404, "Customer receivables not found");
  }

  return record;
};
