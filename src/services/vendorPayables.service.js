import { VendorPayables } from "../models/vendorPayables.model.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const saveVendorPayablesService = async ({
  userId,
  periodValue,
  ...data
}) => {
  if (!userId || !periodValue) {
    throw new ApiError(400, "Month is required");
  }

  return await VendorPayables.findOneAndUpdate(
    { userId, periodValue },
    { $set: data },
    { new: true, upsert: true }
  );
};

export const getVendorPayablesService = async ({
  userId,
  periodValue
}) => {
  const record = await VendorPayables.findOne({ userId, periodValue });

  if (!record) {
    throw new ApiError(404, "Vendor payables not found  Ok. ");
  }

  return record;
};
