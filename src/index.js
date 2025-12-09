import connectDB from "./db/DBconnection.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
    path:'./.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 4000 , () =>{
        console.log(`Server is running : ${process.env.PORT}`)
    })
})
.catch((err) =>{
    console.log("Database connection is failed.",err , "😢")
})

export default app