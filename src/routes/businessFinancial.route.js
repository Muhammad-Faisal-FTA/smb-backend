import {Router} from "express"
import { businessFinancial } from "../controllers/businessFinancial.controller.js";
import jwt from "jsonwebtoken"
import { verifyJWT } from "../middleware/auth.middleware.js";

const businessFinancialRoute = Router();

businessFinancialRoute.route("/business-financial", verifyJWT).post(businessFinancial);

export default businessFinancialRoute;