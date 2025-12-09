
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import useAuthRoute from './routes/auth.route.js';

const app = express();

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



export default app;
