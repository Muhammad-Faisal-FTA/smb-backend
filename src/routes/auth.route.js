import { Router } from "express";
import { register, verifyEmail, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const authRoute = Router();


authRoute.route("/user-register").post(register);
authRoute.route("/verify-email").post(verifyEmail);
authRoute.route("/user-login").post( login);
authRoute.route("/forgot-password").post(forgotPassword);
authRoute.route("/reset-password").post(resetPassword);
// authRoute.route("/change-password").post();
export default authRoute;