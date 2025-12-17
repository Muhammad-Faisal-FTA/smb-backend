import {Router} from "express"
import { businessFinancial } from "../controllers/businessFinancial.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const businessFinancialRoute = Router();

businessFinancialRoute.route("/business-financial").post(verifyJWT, businessFinancial);

export default businessFinancialRoute;