import {asyncHandler} from '../utils/asyncHandler.utils.js';
// import { ApiError } from '../utils/apiError.utils.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.utils.js';
import {sendVerificationEmail} from '../emails/Email.js';

import { 
   registerUserService,
   verifyEmailService, 
   loginUserService ,
   forgotPasswordService,
   resetPasswordService
  } from '../services/auth.service.js';


// Register new user controller
export const register = asyncHandler(async (req, res) => {
  const { user, verificationCode } = await registerUserService(req.body);
  const safe = user.toObject();
  delete safe.password;
  res.status(201).json(new ApiResponse(201, { user: safe, verificationCode }, "Registered; verify your email",));
  // verification email sending
  await sendVerificationEmail(user.email, verificationCode);
  console.log("Verification  email sent to:", verificationCode);
});


// Verify user email controller
export const verifyEmail = asyncHandler(async (req, res) => {
  const {userId,verificationCode} = req.body;
  // const userId = await User.findOne({ verificationCode: verificationCode });
  // const { userId, verificationCode } = req.body;
  await verifyEmailService(userId , verificationCode);
  console.log("Email verified for user ID:", userId, verificationCode);
  
  res.status(200).json(new ApiResponse(200, "Email verified successfully"));
});

// Login user controller
export const login = asyncHandler(async (req, res) => {
  await loginUserService(req.body.email, req.body.password);
  res.status(200).json(new ApiResponse(200, "Login successful"));
});

// Forgot password controller (to get the email from user) 
// forgotPAssword === get user email and send otp
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordService(email);

  res.status(200).json(new ApiResponse(200, `Forgot password process initiated successfully! Check your email: ${email} for the OTP.`));
});

// resetPassword controller
export const resetPassword = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;
  await resetPasswordService(otp, newPassword);
  res.status(200).json(new ApiResponse(200, "Password has been reset successfully!"));
});

// Reset password controller (to be implemented)