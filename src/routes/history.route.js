import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";

import { recordDailyHistory } from "../controllers/dailyHistory.controller.js"

const useRecordDailyHistoryRoute = Router();

useRecordDailyHistoryRoute.route("/daily-history").post(verifyJWT, recordDailyHistory);

export default useRecordDailyHistoryRoute;