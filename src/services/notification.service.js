// import { Notification } from "../models/notification.model.js";
// import { ApiError } from "../utils/ApiError.utils.js";
// export class NotificationService {
//   /* Dashboard counters */
//   static async getSummary(userId) {
//     const [summary] = await Notification.aggregate([
//       { $match: { userId } },
//       {
//         $group: {
//           _id: null,
//           critical: {
//             $sum: { $cond: [{ $eq: ["$type", "CRITICAL"] }, 1, 0] }
//           },
//           warnings: {
//             $sum: { $cond: [{ $eq: ["$type", "WARNING"] }, 1, 0] }
//           },
//           info: {
//             $sum: { $cond: [{ $eq: ["$type", "INFO"] }, 1, 0] }
//           },
//           unread: {
//             $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] }
//           },
//           total: { $sum: 1 }
//         }
//       }
//     ]);

//     return summary || {
//       critical: 0,
//       warnings: 0,
//       info: 0,
//       unread: 0,
//       total: 0
//     };
//   }

//   /* Alert Center list */
//   static async getNotifications(userId, filter = {}) {
//     const query = { userId };

//     if (filter.unread) query.isRead = false;
//     if (filter.type) query.type = filter.type;

//     return Notification.find(query)
//       .sort({ createdAt: -1 })
//       .limit(50);
//   }

//   /* Create notification (used by AI, rules engine, cron jobs) */
//   static async create(data) {
//     return Notification.create(data);
//   }

//   /* Mark single alert as read */
//   static async markAsRead(notificationId, userId) {
//     return Notification.findOneAndUpdate(
//       { _id: notificationId, userId },
//       { isRead: true },
//       { new: true }
//     );
//   }

//   /* Mark all as read */
//   static async markAllAsRead(userId) {
//     return Notification.updateMany(
//       { userId, isRead: false },
//       { isRead: true }
//     );
//   }
// }

// // export default NotificationService;


// import { Notification } from "../models/notification.model.js";
// import { getIO } from "../socket/index.js";

// export class NotificationService {
//   static async create(data) {
//     const notification = await Notification.create(data);

//     // 🔔 Emit real-time alert
//     const io = getIO();
//     io.to(data.userId.toString()).emit("notification:new", {
//       id: notification._id,
//       type: notification.type,
//       title: notification.title,
//       message: notification.message,
//       category: notification.category,
//       createdAt: notification.createdAt
//     });

//     return notification;
//   }
// }

// export default NotificationService;


import { Notification } from "../models/notification.model.js";
import { getIO } from "../socket/index.js";

export class NotificationService {

  /* =========================
     DASHBOARD SUMMARY
  ========================== */
  static async getSummary(userId) {
    const [summary] = await Notification.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          critical: {
            $sum: { $cond: [{ $eq: ["$type", "CRITICAL"] }, 1, 0] }
          },
          warnings: {
            $sum: { $cond: [{ $eq: ["$type", "WARNING"] }, 1, 0] }
          },
          info: {
            $sum: { $cond: [{ $eq: ["$type", "INFO"] }, 1, 0] }
          },
          unread: {
            $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      }
    ]);

    return summary || {
      critical: 0,
      warnings: 0,
      info: 0,
      unread: 0,
      total: 0
    };
  }

  /* =========================
     ALERT CENTER LIST
  ========================== */
  static async getNotifications(userId, filter = {}) {
    const query = { userId };

    if (filter.unread === "true") query.isRead = false;
    if (filter.type) query.type = filter.type;

    return Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
  }

  /* =========================
     CREATE + SOCKET EMIT
  ========================== */
  static async create(data) {
    const notification = await Notification.create(data);

    // 🔔 Real-time socket emit
    try {
      const io = getIO();
      io.to(data.userId.toString()).emit("notification:new", {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        category: notification.category,
        createdAt: notification.createdAt
      });
    } catch (err) {
      console.error("Socket emit failed:", err.message);
    }

    return notification;
  }

  /* =========================
     MARK SINGLE READ
  ========================== */
  static async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  /* =========================
     MARK ALL READ
  ========================== */
  static async markAllAsRead(userId) {
    return Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  }
}
