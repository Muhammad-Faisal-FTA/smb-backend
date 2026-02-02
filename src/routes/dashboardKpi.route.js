import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { dashboardKpiCtrl } from "../controllers/dashboardKpi.controller.js";

const useDashboardKpiRoute = Router();

useDashboardKpiRoute.route("/kpi").get(verifyJWT, dashboardKpiCtrl);

export default useDashboardKpiRoute;