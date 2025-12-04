import mongoose from "mongoose";
import { DB_Name} from "../constant.js";

const connectDB  = async () => {
    try{
        const connectionPoint =  await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${DB_Name}`);
        console.log("Connect database!");
        console.log("Host : ", connectionPoint.connection.host); 
    }catch(err){
        console.log("Error database connection:" ,err.errmsg , "Not able to connect database");
        process.exit(1);
    }
}

export default connectDB;