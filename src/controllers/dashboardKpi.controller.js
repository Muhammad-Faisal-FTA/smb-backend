import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import {dashboardKpi} from "../services/dashboardKips.service.js"

export const dashboardKpiCtrl = asyncHandler(async(req, res) => {
    const kpis = await dashboardKpi();

    res.status(201).json(
    new ApiResponse(201, kpis, "successfully")
  );
})