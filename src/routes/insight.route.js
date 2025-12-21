import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";

import { generateInsights } from "../controllers/insight.controller.js"

const insightsRoute = Router();

insightsRoute.route("/insights").post(verifyJWT, generateInsights);

export default insightsRoute;