// import { BusinessProfile } from "../models/businessProfile.model.js";
// import { ApiError } from "../utils/ApiError.utils.js";

// export const createBusinessProfileService = async (
//     {
//   userId,
//   businessName,
//   businessType,
//   employeesRange,
//   region,
//   currency,
//   financialYearStart,
//   annualRevenueBracket,
//   operatingModel,
//   adminEmail}
// ) => {
//   // const existing = await BusinessProfile.findOne({ $or: [{ businessName }, { adminEmail }] });
//   //   if (existing) throw new ApiError(409, "Business name or admin email already exists");
    
//     const businessProfile = await BusinessProfile.findOneAndUpdate({
//   userId,    
//   businessName,
//   businessType,
//   employeesRange,
//   region,
//   currency,
//   financialYearStart,
//   annualRevenueBracket,
//   operatingModel,
//   adminEmail
//     });
//   console.log("Profile Service : ", businessProfile)
//   return businessProfile;
// }

import { BusinessProfile } from "../models/businessProfile.model.js";
import { ApiError } from "../utils/ApiError.utils.js";

export const createBusinessProfileService = async ({
  userId,
  businessName,
  businessType,
  employeesRange,
  region,
  currency,
  financialYearStart,
  annualRevenueBracket,
  operatingModel,
  adminEmail,
}) => {
  if (!userId) {
    throw new ApiError(400, "UserId is required");
  }
console.log("patch Api profile: ", userId)
  const businessProfile = await BusinessProfile.findOneAndUpdate(
    // 🔍 Filter (how to find the document)
    { userId },

    // ✏️ Update (what to change)
    {
      $set: {
        businessName,
        businessType,
        employeesRange,
        region,
        currency,
        financialYearStart,
        annualRevenueBracket,
        operatingModel,
        adminEmail,
      },
    },

    //  Options
    {
      new: true,     // return updated document
      upsert: true,  // create if not exists
      runValidators: true,
    }
  );

  return businessProfile;
};

export const getBusinessProfileDataService = async (userId) => {
  
  const businessProfileData = await BusinessProfile.findOne({ userId });
  return businessProfileData;
};