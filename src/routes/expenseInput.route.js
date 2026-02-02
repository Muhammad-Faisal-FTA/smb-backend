import { Router } from "express";
import {
  saveMonthlyExpenseCtrl,
  getMonthlyExpenseCtrl
} from "../controllers/expenseInput.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const useExpenseInputRouter = Router();

useExpenseInputRouter.route("/expenses/insert").post( verifyJWT, saveMonthlyExpenseCtrl);
useExpenseInputRouter.route("/expenses/get").get( verifyJWT, getMonthlyExpenseCtrl);
// router.get("/expenses/monthly", verifyJWT, getMonthlyExpenseCtrl);

export default useExpenseInputRouter;
