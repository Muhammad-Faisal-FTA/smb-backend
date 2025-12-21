// import { ApiResponse } from "../utils/ApiResponse.utils.js";
// import {asyncHandler} from '../utils/asyncHandler.utils.js';
// import {createBusinessProfileService} from "../services/businessProfile.service.js"

// // business profile controller
// export const businessProfile = asyncHandler(async (req, res) => {
//     // const userId = req.user.userId; // 👈 SAFE & TRUScTED

//   // const result = await createBusinessProfileService({
//   //   ...req.body,
//   // //   userId,
//   // });
//     // Call the service to create a business profile
//     const businessProfile = await createBusinessProfileService(req.body);

//     res.status(201).json(new ApiResponse(201, businessProfile, "Business profile created successfully"  ));
// });


import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { createBusinessProfileService, getBusinessProfileDataService } from "../services/businessProfile.service.js";

// business profile controller
export const businessProfile = asyncHandler(async (req, res) => {
  // 🔐 userId comes ONLY from auth middleware
  // console.log("Profile controller user:", userId )
  //   if (!req.user) {
  //   throw new Error(401, "User not authenticated");
  // }
  // merge trusted userId with request payload
  const userId = req.user._id
  const businessProfile = await createBusinessProfileService({
    ...req.body,  // ✅ Spread inside object literal
    userId
  });
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        businessProfile,
        "Business profile created successfully"
      )
    );
});


  export const businessProfileData = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const businessProfileData = await getBusinessProfileDataService(
      userId
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        businessProfileData,
        "Business profile data successfully"
      )
    );

})