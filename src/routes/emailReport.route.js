import express from 'express';
import { 
  sendReportToUser, 
  previewReportData,
  sendReportToMultiple,
  scheduleMonthlyReports,
  getReportHistory
} from '../controllers/emailReport.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js'; // Your auth middleware

const useEmailReportRouter = express.Router();

/* ---------------- ALL ROUTES REQUIRE AUTHENTICATION ---------------- */
// useEmailReportRouter.use(authMiddleware);

/* ---------------- SEND REPORT ROUTES ---------------- */

// POST /api/reports/send
// Send financial report to user's email or specified email
useEmailReportRouter.route('/send').post( verifyJWT, sendReportToUser);

// POST /api/reports/send-multiple
// Send report to multiple email addresses
useEmailReportRouter.route('/send-multiple').post( verifyJWT, sendReportToMultiple);

/* ---------------- PREVIEW & DATA ROUTES ---------------- */

// GET /api/reports/preview
// Preview report data without sending email
useEmailReportRouter.route('/preview').get(verifyJWT, previewReportData);

// GET /api/reports/history
// Get history of sent reports
useEmailReportRouter.route('/history').get(verifyJWT, getReportHistory);

/* ---------------- SCHEDULING ROUTES ---------------- */

// POST /api/reports/schedule
// Enable/disable automatic monthly reports
useEmailReportRouter.route('/schedule').post(verifyJWT, scheduleMonthlyReports);

export default useEmailReportRouter;


/* ---------------- USAGE IN MAIN APP ---------------- */
/*
// In your app.js or index.js:

import emailReportRoutes from './routes/emailReport.routes.js';

app.use('/api/reports', emailReportRoutes);
*/