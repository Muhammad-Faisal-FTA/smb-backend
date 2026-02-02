// import { Router } from "express";
// import {
// saveCustomerReceivablesCtrl
// } from "../controllers/customerReceivables.controller.js";

// import { verifyJWT } from "../middleware/auth.middleware.js";

// const useCustomerReceivables = Router()

// useCustomerReceivables.post(
//   "/customer-receivables/monthly",
//   verifyJWT,
//   saveCustomerReceivablesCtrl
// );
// useCustomerReceivables.get(
//   "/customer-receivables/monthly",
//   verifyJWT,
//   getCustomerReceivablesCtrl
// );

// export default useCustomerReceivables

import { Router } from "express";
import {
  saveCustomerReceivablesCtrl,
  getCustomerReceivablesCtrl
} from "../controllers/customerReceivables.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const useCustomerReceivables = Router();

useCustomerReceivables.post(
  "/customer-receivables/monthly",
  verifyJWT,
  saveCustomerReceivablesCtrl
);

useCustomerReceivables.get(
  "/customer-receivables/monthly",
  verifyJWT,
  getCustomerReceivablesCtrl
);

export default useCustomerReceivables;
