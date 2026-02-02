
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import useAuthRoute from './routes/auth.route.js';
import useBusinessProfileRoute from "./routes/businessProfile.route.js";
import useBusinessFinancialRoute from "./routes/businessFinancial.route.js";
import useBusinessHealthRoute from "./routes/healthScore.routes.js";
import useInsightRoute from './routes/insight.route.js';
import useRecordDailyHistoryRoute from './routes/history.route.js';
import useNotificationRoute  from './routes/notification.route.js';
import useDashboardKpiRoute from './routes/dashboardKpi.route.js'
<<<<<<< HEAD
=======
import useEmailReportRouter from './routes/emailReport.route.js';
import useRevenueInput from './routes/revenueInput.routes.js';
import useExpenseInputRouter from './routes/expenseInput.route.js';
import useAssetsLiabilitiesRouter from './routes/assetsLiabilities.routes.js'
import useCustomerReceivablesCtrl from './routes/customerReceivables.routes.js'
import useVendorPayablesCtrlRouter from './routes/vendorPayables.routes.js'
import useFinancialForecastRouter from './routes/financialForecast.route.js'


>>>>>>> 2587921485894f1c30523acc081e029fd1555151
const app = express();  //Express application instance, handle all http req &res.

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "980kb"}))
app.use(express.urlencoded({limit: "980kb"}))
app.use(express.static("public"))

app.use(cookieParser())


// Auth api
app.use('/api/v1/auth', useAuthRoute);
app.use('/api/v1/otp', useAuthRoute);
app.use('/api/v1/auth', useAuthRoute);
app.use('/api/v1/pass', useAuthRoute);//for forgot password
app.use('/api/v1/newpass', useAuthRoute);// for reset password
// http://localhost:5000/api/v1/auth/user-register

// Business Profile api
app.use('/api/v1/profile', useBusinessProfileRoute);
// http://localhost:5000/api/v1/profile/business-profile

// Business Financial api
app.use('/api/v1/finance', useBusinessFinancialRoute);
// http://localhost:5000/api/v1/finance/business-financial

app.use('/api/v1/health', useBusinessHealthRoute);
// http://localhost:5000/api/v1/health/business-health

app.use('/api/v1/ai', useInsightRoute);
// http://localhost:5000/api/v1/ai/insights

app.use('/api/v1/history', useRecordDailyHistoryRoute);
// http://localhost:5000/api/v1/history/daily-history

app.use('/api/v1/notifications', useNotificationRoute);
// http://localhost:5000/api/v1/notifications/summary


<<<<<<< HEAD
app.use('api/v1/dashboard', useDashboardKpiRoute);
// http://localhost:5000/api/v1/dashboard/kpi

=======
app.use('/api/v1/dashboard', useDashboardKpiRoute);
// http://localhost:5000/api/v1/dashboard/kpi


app.use('/api/v1',useEmailReportRouter)
// http://localhost:5000/api/v1/


app.use('/api/v1/input',useRevenueInput)
// http://localhost:5000/api/v1/input/revenue/insert
// http://localhost:5000/api/v1/input/revenue/get

app.use('/api/v1/input',useExpenseInputRouter)
// http://localhost:5000/api/v1/input/expenses/insert

app.use('/api/v1/input',useAssetsLiabilitiesRouter)
// http://localhost:5000/api/v1/input/assets-liabilities/monthly

app.use('/api/v1/input', useCustomerReceivablesCtrl)


app.use('/api/v1/input', useVendorPayablesCtrlRouter)


app.use('/api/v1/ai', useFinancialForecastRouter)
>>>>>>> 2587921485894f1c30523acc081e029fd1555151

export default app;
