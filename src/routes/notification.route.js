import express from "express";
import {
  getNotificationSummary,
  getNotifications,
  markNotificationRead,
  markAllRead
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const useNotificationRoute = express.Router();

//  Dashboard cards 
useNotificationRoute.route("/summary").get(verifyJWT, getNotificationSummary);

//  Alert center list 
useNotificationRoute.route("/").get(verifyJWT, getNotifications);

//  Mark read 
useNotificationRoute.route("/:id/read").patch(verifyJWT, markNotificationRead);

//  Mark all read 
useNotificationRoute.route("/read-all").patch(verifyJWT, markAllRead);

export default useNotificationRoute ;
