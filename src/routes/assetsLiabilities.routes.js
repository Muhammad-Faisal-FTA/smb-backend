import { Router } from "express";
import {
  saveAssetsLiabilitiesCtrl,
  getAssetsLiabilitiesCtrl
} from "../controllers/assetsLiabilities.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";



const useAssetsLiabilitiesRouter = Router();

useAssetsLiabilitiesRouter.route("/assets-liabilities/monthly").post( verifyJWT, saveAssetsLiabilitiesCtrl);
useAssetsLiabilitiesRouter.route("/assets-liabilities/monthly").get( verifyJWT, getAssetsLiabilitiesCtrl);

export default useAssetsLiabilitiesRouter;
