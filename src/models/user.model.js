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
  if (!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password, 12); // cost 12 for production balance
  this.lastPasswordChange = Date.now();
  // next();
});

// ---------Instance Methods--------------
userSchema.methods.isValidPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

// Use hashed refresh token in DB for safety
userSchema.methods.setRefreshToken = async function(plainToken) {
  const hashed = crypto.createHash("sha256").update(plainToken).digest("hex");
  this.refreshToken = hashed;
  await this.save();
};

userSchema.methods.matchRefreshToken = function(plainToken) {
  if (!this.refreshToken) return false;
  const hashed = crypto.createHash("sha256").update(plainToken).digest("hex");
  return hashed === this.refreshToken;
};


  export const User = mongoose.model("User", userSchema);