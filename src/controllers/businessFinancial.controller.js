import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {asyncHandler} from '../utils/asyncHandler.utils.js';

import { createBusinessFinancialService } from "../services/businessFinancial.service.js"

export const businessFinancial = asyncHandler(async (req, res) => {
    // Call the service to create a business financial
    // console.log( "req", req)
      const userId = req.user._id

    const businessFinancial = await createBusinessFinancialService({
    ...req.body,  // ✅ Spread inside object literal
    userId
  });

    res.status(201).json(new ApiResponse(201, businessFinancial, "Business financial created successfully"));
});
