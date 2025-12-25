import { sendFinancialReport, gatherReportData } from '../services/emailReport.service.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.utils.js';
import { ApiError } from '../utils/ApiError.utils.js';

/* ---------------- SEND REPORT TO USER ---------------- */
export const sendReportToUser = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized access');
  }

  const result = await sendFinancialReport(userId);

  return res.status(200).json(
    new ApiResponse(200, {
      messageId: result.messageId,
      recipient: result.recipient,
      businessName: result.businessName
    }, `Financial report sent successfully to ${result.recipient}`)
  );
};

/* ---------------- PREVIEW REPORT DATA (Without Sending) ---------------- */
export const previewReportData = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized access');
  }

  const reportData = await gatherReportData(userId);

  if (!reportData) {
    throw new ApiError(404, 'No report data found');
  }

  return res.status(200).json(
    new ApiResponse(200, {
      businessProfile: {
        businessName: reportData.businessProfile.businessName,
        businessType: reportData.businessProfile.businessType,
        region: reportData.businessProfile.region,
        currency: reportData.businessProfile.currency
      },
      period: reportData.period,
      metrics: reportData.metrics,
      dailyAverages: reportData.dailyAverages
    }, 'Report data retrieved successfully')
  );
};

/* ---------------- SEND REPORT TO MULTIPLE RECIPIENTS ---------------- */
export const sendReportToMultiple = async (req, res) => {
  const userId = req.user?._id;
  const { emails } = req.body;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized access');
  }

  if (!Array.isArray(emails) || emails.length === 0) {
    throw new ApiError(400, 'Please provide a non-empty array of email addresses');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = emails.filter(email => !emailRegex.test(email));

  if (invalidEmails.length > 0) {
    throw new ApiError(400, 'Invalid email addresses detected', invalidEmails);
  }

  const results = await Promise.allSettled(
    emails.map(email => sendFinancialReport(userId, email))
  );

  const successful = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');

  return res.status(200).json(
    new ApiResponse(200, {
      total: emails.length,
      successful: successful.length,
      failed: failed.length,
      results: results.map((result, index) => ({
        email: emails[index],
        status: result.status,
        messageId: result.status === 'fulfilled'
          ? result.value.messageId
          : null,
        error: result.status === 'rejected'
          ? result.reason?.message
          : null
      }))
    }, `Reports sent to ${successful.length} of ${emails.length} recipients`)
  );
};

/* ---------------- SCHEDULE AUTOMATIC MONTHLY REPORT ---------------- */
export const scheduleMonthlyReports = async (req, res) => {
  const userId = req.user?._id;
  const { enabled, dayOfMonth = 1 } = req.body;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized access');
  }

  if (enabled && (dayOfMonth < 1 || dayOfMonth > 28)) {
    throw new ApiError(400, 'dayOfMonth must be between 1 and 28');
  }

  await User.findByIdAndUpdate(userId, {
    'preferences.monthlyReportEnabled': enabled,
    'preferences.monthlyReportDay': dayOfMonth
  });

  return res.status(200).json(
    new ApiResponse(200, {
      enabled,
      dayOfMonth
    }, enabled
      ? `Monthly reports scheduled for day ${dayOfMonth}`
      : 'Monthly reports disabled'
    )
  );
};

/* ---------------- GET REPORT HISTORY ---------------- */
export const getReportHistory = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized access');
  }

  // Placeholder until ReportLog model exists
  return res.status(200).json(
    new ApiResponse(200, {
      reports: []
    }, 'Report history retrieved successfully')
  );
};
