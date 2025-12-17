
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import useAuthRoute from './routes/auth.route.js';
import useBusinessProfileRoute from "./routes/businessProfile.route.js";
import useBusinessFinancialRoute from "./routes/businessFinancial.route.js";
import useBusinessHealth from "./routes/healthScore.routes.js"

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
app.use('/api/v1/', useBusinessProfileRoute);
// http://localhost:5000/api/v1/business-profile

// Business Financial api
app.use('/api/v1', useBusinessFinancialRoute);
// http://localhost:5000/api/v1/business-financial

app.use('/api/v1', useBusinessHealth);
// http://localhost:5000/api/v1/business-health

export default app;
