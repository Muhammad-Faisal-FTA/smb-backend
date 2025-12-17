import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken"

// custom middleware
export const verifyJWT = asyncHandler( async(req, res, next) => {
    
try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
      if(!token){
       throw new ApiError(401, "Unauthorized request🚫")
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

       console.log("🧩 JWT payload:", decodedToken);
       console.log("🔐 Raw token:", token);
       console.log("👤 User from DB:", user);
          console.log("🧩 Decoded JWT:", decodedToken);

      const userId = decodedToken._id;    //!be care effect the ruing health score.
      const user = await User.findById(decodedToken._id).select(
       "-password -refreshToken"
      )
      // console.log("User in middleware:", user);
   
      console.log("🧩 JWT User: ", user)
      if (!user) {
         // DIscus about front end
         throw new ApiError(401,"Invalid access🛑")
      }
      req.user = user;
      next();
} catch (error) {
   throw new ApiError(401,"Invalid User 🛑")
}

}) 
