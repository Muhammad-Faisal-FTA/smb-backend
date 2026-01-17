import { Router } from "express";
import { generateFinancialForecastCtrl } from "../controllers/financialForecast.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const useFinancialForecastRouter = Router()

useFinancialForecastRouter.route('/forecast').get(verifyJWT , generateFinancialForecastCtrl)

export default useFinancialForecastRouter
