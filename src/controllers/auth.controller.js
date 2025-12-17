import {asyncHandler} from '../utils/asyncHandler.utils.js';
// import { ApiError } from '../utils/apiError.utils.js';
// import { User } from '../models/user.model.js';
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
  const { email, password } = req.body;

  // 1. FIX: Capture the user returned by the service
  // Your service should verify password and return the user document
  const user = await loginUserService(email, password); 

  // 2. FIX: Generate tokens directly on the user instance
  // (We don't need to query the DB again with findById)
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // 3. Save the refresh token to the database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // 4. Define Cookie Options (This was missing)
  const options = {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
  };

  // 5. FIX: Use 'cookie' (singular), not 'cookies'
  return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
          new ApiResponse(
              200, 
              { 
                  user: { _id: user._id, email: user.email }, // Send safe user data
                  accessToken, 
                  refreshToken 
              }, 
              "Login successful"
          )
      );
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