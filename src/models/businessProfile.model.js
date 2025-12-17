import mongoose, { Schema } from 'mongoose';
// import { type } from 'os';

const businessProfileSchema = new Schema({
    userId:{
     type: Schema.Types.ObjectId,
     ref: "User",
     required: true
    },
  businessName:{
    type: String,
    trim: true,
    unique: true,
    required: [true, "Business name is required!"]
  },
  businessType:{
    type: String,
    trim: true,
    required: [true, "Business type is required!"]
  },
  employeesRange: {
    type: String,
    required: [true, "employees are required!"]
  }, 
  region:{
    type: String,
    trim: true,
    required: [true, "Country is required!"]
  },
   currency : {
    type: String,
    trim: true,
    enum: ['PKR', 'USD',  'INR', 'GBP', 'AUD', 'CAD', 'JPY'], // Example currencies
},
  financialYearStart:{
    type: Date,
  },
  annualRevenueBracket: {
    type: String,
    required: [true, "annual range is requires!"]
  },
  operatingModel: {
    type: String,
    required: [true, "operating model is required!"]
  },
  adminEmail:{
    type: String,
    trim: true,
    required: [true, "Admin email is required!"]
  }
//   textRete Number

}, { timestamps: true });


export const BusinessProfile = mongoose.model('BusinessProfile', businessProfileSchema);