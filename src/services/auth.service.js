// In this service all  the user authentication done here. Email verification, all validation for data and data base existence, password hashing etc.

import jwt from "jsonwebtoken";
// import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { sendWelcomeEmail, sendVerificationEmail } from "../emails/Email.js";

// const signRefreshToken = (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });


//Register new user 
export const registerUserService = async (
    { fullName, phoneNumber, email, password  }
) => {
  const existing = await User.findOne({ $or: [{ fullName }, { email }] });
  if (existing) throw new ApiError(409, "Username or email already exists");

  const verificationCode= Math.floor(100000 + Math.random() * 900000).toString()
  const user = await User.create({ 
    fullName, 
    phoneNumber, 
    email, 
    password: password,
    verificationCode: verificationCode,
    verificationCodeExpires: Date.now() + 2 * 60 * 1000 // 2 minutes from now
  });


  console.log("Verification Token: ", verificationCode);

  return { user, verificationCode };
};
// Send verification code email (this service also use in forgot password otp sending.)
// this done in Email.js file for now.


// Verify user email (this service also use in forgot password otp verification.)
export const verifyEmailService = async ( userId , receivedCode) => {

  const user = await User.findById(userId);
  console.log("Verifying email for user ID:", userId)
  if (!user) throw new ApiError(404, "User not found");
  if (user.isVerified) throw new ApiError(400, "User already verified");
  if (user.verificationCode !== receivedCode) throw new ApiError(400, "Invalid verification token");
  if (user.verificationCodeExpires < Date.now()) throw new ApiError(400, "Verification token expired");
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();
  // send welcome email
  if(user.isVerified){
    await sendWelcomeEmail(user.email, user.fullName);
  }
  return user;
}

// Login user service
export const loginUserService = async (email, password) => {
  // Find user and explicitly select password if it's hidden by default
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials: email not found');
  }
  
  const isValid = await user.isValidPassword(password);
  
  if (!isValid) {
    throw new Error('Invalid credentials: incorrect password');
  }
  
  return user;
};

// Forgot password service 
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found or invalid email");

  const verificationToken= Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = verificationToken;
  user.verificationCodeExpires = Date.now() + 4 * 60 * 1000;
  await user.save();
  await sendVerificationEmail(user.email, verificationToken);

  console.log("Forgot Password Verification Token: ", verificationToken);
}

// Reset password service 
export const resetPasswordService = async (verificationCode, newPassword) => {
  const user = await User.findOne({ verificationCode });

  if (!user) throw new ApiError(404, "User not found");
  if (user.verificationCode !== verificationCode) throw new ApiError(400, "Invalid verification token");
  if (user.verificationCodeExpires < Date.now()) throw new ApiError(400, "Verification token expired");
  user.password = newPassword;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();
  return user;
}

// Generate access and refresh tokens