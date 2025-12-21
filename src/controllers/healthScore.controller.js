import { BusinessFinancial } from "../models/businessFinancial.model.js";
import { calculateBusinessHealth } from "../services/healthScore.service.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

export const calculateHealthController = asyncHandler(async (req, res) => {
    
    // 1. GET USER ID
    // verifyJWT middleware put the user object here.
        const userId = req.user._id;
        const userIdstr = userId.toString();
        // 2. FETCH DATA
        // Find the financial record that belongs to this logged-in user.
        // IMPORTANT: Check if your DB uses 'owner', 'user', or 'business_id' to link to the user.
        const financialData = await BusinessFinancial.findOne({ 
                userId: userIdstr  // <--- (MATCH THIS FIELD TO  DATABASE SCHEMA)
            }).sort({ createdAt: -1 });

            console.log("financialData",financialData)

    // 3. HANDLE MISSING DATA
    if (!financialData) {
        return res.status(404).json(
            new ApiResponse(404, null, "No financial data found for this user. Please upload data first.")
        );
    }

    const financialHistory = await BusinessFinancial.find({ 
    userId: userId.toString() // Ensure ID matches your DB format
    })
    .sort({ periodStart: -1 }) // Sort by newest first
    .limit(12);
    
    if (!financialHistory || financialHistory.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No financial data found."));
    }

    const monthlyCashflows = financialHistory.map(record => record.netProfit);
    // / We can take the average expenses from history, or just the most recent one
    const recentExpenses = financialHistory[0].monthlyOperatingExpenses;

    // G
    // 4. CALCULATE
    // Pass the entire data object (not just ID) to the service
    const healthScoreResult = await calculateBusinessHealth(financialData,{
        monthlyCashflows,     // The array [100, 200, -50...]
        monthlyExpenses: recentExpenses,
        // ... pass other data from financialHistory[0] (the latest record)
        latestData: financialHistory[0] 
    });
    
    
    // 5. SEND RESPONSE
    return res.status(200).json(
        new ApiResponse(200, healthScoreResult, "Health score calculated successfully!")
    );
});