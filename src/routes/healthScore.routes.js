import {Router} from "express";
import { calculateHealthController } from "../controllers/healthScore.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const useBusinessHealth = Router();

useBusinessHealth.get("/business-health",verifyJWT, calculateHealthController);

export default useBusinessHealth;
