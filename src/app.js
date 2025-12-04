
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "980kb"}))
app.use(express.urlencoded({limit: "980kb"}))
app.use(express.static("public"))

app.use(cookieParser())

import useTestRoutes from './routes/apiTest.route.js';
app.use('/api', useTestRoutes)
app.use('/api', useTestRoutes)
// http://localhost:5000/api/testWritingData



//  routes import
// import userRoutes from "./routes/user.routes.js"

// routes declaration
// app.use("/api/v1/user", userRoutes)
// app.use("/api/v1/login", userRoutes)
// app.use("/api/v1/sample", userRoutes)
//  http://localhost:8000/api/v1/user/register
//  https://localhost:3000/api/v1/user/login

export default app;
