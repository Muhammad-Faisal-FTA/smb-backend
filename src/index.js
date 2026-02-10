import connectDB from "./db/DBconnection.js";
import app from "./app.js";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./socket/index.js";


import { setupMonthlyReportCron } from './cron/index.js';


dotenv.config({
    path:'./.env'
})

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

connectDB()
.then(() => {
    server.listen(process.env.PORT || 4000 , () =>{
        console.log(`Server is running : ${process.env.PORT}`)
    })
    // setupMonthlyReportCron()
})
.catch((err) =>{
    console.log("Database connection is failed.",err , "😢")
})

export default app