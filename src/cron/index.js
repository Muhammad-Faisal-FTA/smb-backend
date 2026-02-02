

  //  CRON JOB SETUP (for automatic monthly reports)

import cron from 'node-cron';
import { User } from '../models/user.model.js';
import { sendFinancialReport } from '../services/emailReport.service.js';

/* ---------------- MONTHLY REPORT SCHEDULER ---------------- */
export const setupMonthlyReportCron = () => {
  // Runs on the 1st day of every month at 9:00 AM   0 9 1 * *
  cron.schedule('0 9 1 * *', async () => {
    console.log('🔄 Running monthly report scheduler...');
    try {
      // Find all users with monthly reports enabled
      const users = await User.find({
        // 'preferences.monthlyReportEnabled': true
        email:'f23bseen1m01011@gmail.com'   // hard find for just for testing 
      }).select(' email ');
      
      console.log(`📧 Sending reports to ${users.length} users...`);
      
      // Send reports
      const results = await Promise.allSettled(
        users.map(user => 
          sendFinancialReport(user._id, user.email)
            .then(() => ({ userId: user._id, status: 'success' }))
            .catch(err => ({ userId: user._id, status: 'failed', error: err.message }))
        )
      );
      
      const successful = results.filter(r => r.value?.status === 'success').length;
      const failed = results.filter(r => r.value?.status === 'failed').length;
      
      console.log(`Monthly reports sent: ${successful} successful, ${failed} failed`);
      
      // Optionally log to database
      // await ReportLog.create({
      //   type: 'monthly',
      //   scheduledAt: new Date(),
      //   totalUsers: users.length,
      //   successful,
      //   failed,
      //   results
      // });
      
    } catch (error) {
      console.error(' Monthly report cron error:', error);
    }
  });
  
  console.log(' Monthly report scheduler initialized');
};

/* ---------------- WEEKLY REPORT SCHEDULER (Optional) ---------------- */
export const setupWeeklyReportCron = () => {
  // Runs every Monday at 9:00 AM
  cron.schedule('0 9 * * 1', async () => {
    console.log('🔄 Running weekly report scheduler...');
    
    try {
      const users = await User.find({
        'preferences.weeklyReportEnabled': true
      }).select('_id email');
      
      console.log(`📧 Sending weekly reports to ${users.length} users...`);
      
      await Promise.allSettled(
        users.map(user => sendFinancialReport(user._id, user.email))
      );
      
      console.log('✅ Weekly reports sent');
      
    } catch (error) {
      console.error('❌ Weekly report cron error:', error);
    }
  });
  
  console.log('✅ Weekly report scheduler initialized');
};

/* ---------------- INITIALIZE ALL CRON JOBS ---------------- */
export const initializeSchedulers = () => {
  setupMonthlyReportCron();
  // setupWeeklyReportCron(); // Uncomment if needed
};


  //  USAGE IN YOUR MAIN APP

/*
// In your app.js or server.js:

import { initializeSchedulers } from './utils/schedulers.js';

// After connecting to database
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log(' Database connected');
  
  // Initialize cron jobs
  initializeSchedulers();
  
  // Start server
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
});
*/


/* ============================================================
   USER MODEL UPDATE (Add preferences field)
   ============================================================ */

/*
// Add to your User schema:

preferences: {
  monthlyReportEnabled: {
    type: Boolean,
    default: false
  },
  monthlyReportDay: {
    type: Number,
    default: 1,
    min: 1,
    max: 28
  },
  weeklyReportEnabled: {
    type: Boolean,
    default: false
  },
  reportFormat: {
    type: String,
    enum: ['html', 'pdf'],
    default: 'html'
  }
}
*/


/* ============================================================
   REPORT LOG MODEL (Optional - for tracking)
   ============================================================ */

/*
import mongoose, { Schema } from 'mongoose';

const reportLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['manual', 'monthly', 'weekly'],
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'bounced'],
    default: 'sent'
  },
  messageId: String,
  sentAt: {
    type: Date,
    default: Date.now
  },
  errorMessage: String
}, { timestamps: true });

export const ReportLog = mongoose.model('ReportLog', reportLogSchema);
*/


/* ============================================================
   PACKAGE INSTALLATION
   ============================================================ */

/*
npm install nodemailer node-cron

// Or with yarn:
yarn add nodemailer node-cron
*/


/* ============================================================
   TESTING THE EMAIL SYSTEM
   ============================================================ */

/*
// Test email sending manually:

import { sendFinancialReport } from './services/emailReport.service.js';

// In a test route or script:
app.get('/test-email', async (req, res) => {
  try {
    const result = await sendFinancialReport(
      'USER_ID_HERE',
      'test@example.com'
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
*/


/* ============================================================
   CRON SCHEDULE PATTERNS
   ============================================================ */

/*
Cron Pattern Format: * * * * *
                      │ │ │ │ │
                      │ │ │ │ └─── Day of week (0-7) (Sunday = 0 or 7)
                      │ │ │ └───── Month (1-12)
                      │ │ └─────── Day of month (1-31)
                      │ └───────── Hour (0-23)
                      └─────────── Minute (0-59)

Examples:
'0 9 1 * *'     - 9:00 AM on the 1st of every month
'0 9 * * 1'     - 9:00 AM every Monday
'0 0 * * *'     - Midnight every day
// '0 */6 //* * *'   //- Every 6 hours
// '0 9 * * 1-5'   - 9:00 AM Monday through Friday
// */