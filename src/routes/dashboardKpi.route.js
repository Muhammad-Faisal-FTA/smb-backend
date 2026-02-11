import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getDashboardKpis } from "../controllers/dashboardKpi.controller.js";

const useDashboardKpiRoute = Router();

useDashboardKpiRoute.route("/kpi").get(verifyJWT, getDashboardKpis);

export default useDashboardKpiRoute;