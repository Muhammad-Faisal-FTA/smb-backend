import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";

import { businessProfile } from "../controllers/businessProfile.controller.js"

const businessProfileRoute = Router();

businessProfileRoute.route("/business-profile", verifyJWT).patch(businessProfile);

export default businessProfileRoute;