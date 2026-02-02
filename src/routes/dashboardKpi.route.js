import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";
<<<<<<< HEAD
import { dashboardKpiCtrl } from "../controllers/dashboardKpi.controller.js";

const useDashboardKpiRoute = Router();

useDashboardKpiRoute.route("/kpi").get(verifyJWT, dashboardKpiCtrl);
=======
import { getDashboardKpis } from "../controllers/dashboardKpi.controller.js";

const useDashboardKpiRoute = Router();

useDashboardKpiRoute.route("/kpi").get(verifyJWT, getDashboardKpis);
>>>>>>> 2587921485894f1c30523acc081e029fd1555151

export default useDashboardKpiRoute;