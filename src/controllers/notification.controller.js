import { NotificationService } from "../services/notification.service.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";


//   Dashboard summary

export const getNotificationSummary = asyncHandler(async (req, res) => {
  // const userId = ;
  const summary = await NotificationService.getSummary(req.user.id);
  return res
    .status(200)
    .json(new ApiResponse(200, summary, "Notification summary fetched"));
});


//  Alert center list

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await NotificationService.getNotifications(
    req.user._id,
    req.query
  );

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched"));
});

/**
 * Mark single notification as read
 */
export const markNotificationRead = asyncHandler(async (req, res) => {
  const updated = await NotificationService.markAsRead(
    req.params.id,
    req.user.id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Notification marked as read"));
});

/**
 * Mark all notifications as read
 */
export const markAllRead = asyncHandler(async (req, res) => {
  await NotificationService.markAllAsRead(req.user.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "All notifications marked as read"));
});
