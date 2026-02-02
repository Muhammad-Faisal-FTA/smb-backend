// import {Router} from "express";
// import { verifyJWT } from "../middleware/auth.middleware.js";

// import { saveRevenueInputCtrl, getRevenueInputCtrl  } from "../controllers/revenueInput.controller.js";

// const useRevenueInput = Router();

// useRevenueInput.route('/revenue/insert').post(verifyJWT, saveRevenueInputCtrl);
// useRevenueInput.route('/revenue/get').get(verifyJWT, getRevenueInputCtrl);

// export default useRevenueInput;



import { Router } from "express";
import {
  saveRevenueCtrl,
  getRevenueCtrl
} from "../controllers/revenueInput.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const useRevenueInput = Router();

useRevenueInput.post("/revenue/insert", verifyJWT, saveRevenueCtrl);
useRevenueInput.get("/revenue/get", verifyJWT, getRevenueCtrl);

export default useRevenueInput;
