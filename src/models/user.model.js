// User schema
import mongoose , {Schema} from "mongoose"
import bcrypt from "bcrypt"; // Make sure this is imported!
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    // use the default id of object.
    fullName: {
        type: String,
        trim: true,
        required: [true, "Full name is required!"]
    },
    phoneNumber: {
        type: String,
        trim: true,
        // unique: true,
        // validate: {},
        required: [true, "Phone number is required!"]
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required!"],
    },
    password: {
        type: String,
        trim: true,
        // unique: true,
        required: [true, "Password is required!"]
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
        type: String,
        trim: true,
    },
    verificationCodeExpires: {
        type: Date,
    },

},{timestamps: true})



//  ---------Hooks--------------

//  Hook: pre("save") 
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return 1;
  this.password = await bcrypt.hash(this.password, 12); // cost 12 for production balance
  this.lastPasswordChange = Date.now();
  // next();
});

// ---------Instance Methods--------------
userSchema.methods.isValidPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// 2. Generate Access Token (Short lived, e.g., 15m)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// 3. Generate Refresh Token (Long lived, e.g., 7d)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};


  export const User = mongoose.model("User", userSchema);