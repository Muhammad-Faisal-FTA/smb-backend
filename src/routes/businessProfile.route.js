import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js";

import { businessProfile } from "../controllers/businessProfile.controller.js";
import {businessProfileData} from "../controllers/businessProfile.controller.js"

const businessProfileRoute = Router();

businessProfileRoute.route("/business-profile").patch(verifyJWT, businessProfile);
businessProfileRoute.route("/business-profile-data").get(verifyJWT, businessProfileData);

export default businessProfileRoute;