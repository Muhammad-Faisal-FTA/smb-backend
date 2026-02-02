import { Router } from "express";
import {
  saveVendorPayablesCtrl,
  getVendorPayablesCtrl
} from "../controllers/vendorPayables.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const useVendorPayablesCtrlRouter = Router();

/**
 * Monthly Vendor & Payables
 */
useVendorPayablesCtrlRouter.route(  "/vendor-payables/monthly").post(  verifyJWT, saveVendorPayablesCtrl);

useVendorPayablesCtrlRouter.route(  "/vendor-payables/monthly").get( verifyJWT, getVendorPayablesCtrl);

export default useVendorPayablesCtrlRouter;
