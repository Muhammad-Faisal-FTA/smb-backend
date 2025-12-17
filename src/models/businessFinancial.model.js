import { numberDependencies } from 'mathjs';
import mongoose, { Schema } from 'mongoose';

const businessFinancialSchema = new Schema({
    userId:{
     type: Schema.Types.ObjectId,
     ref: "User",
     required: true
    },
  periodStart:{
    type: Date,
    trim: true,
    required: [true, "Period start is required!"]
  },
  periodEnd :{
    type: Date,
    trim: true,
    required: [true, "Period end is required!"]
  }, 
  cash:{
    type: Number,
    trim: true,
    required: [true, "Cash is required!"]
  },
   bankBalance : {    //business's bank balance
    type: Number,
    trim: true,
    required: [true, "Bank balance is required!"]
},
  accountsReceivable:{
    type: Number,
    required: [true, "Accounts receivable is required!"]
},
  inventory:{
    type: Number,
    trim: true,
    required: [true, "Inventory is required!"]
},
currentAssetsOther:{
    type: Number,
    trim: true,
    required: [true, "Current assets other is required!"]
},
currentLiabilities:{
    type: Number,
    trim: true,
    required: [true, "Current liabilities is required!"]
},
monthlyOperatingExpenses:{
    type: Number,
    trim: true,
    required: [true, "Monthly operating expenses is required!"]
},
revenue:{
    type: Number,
    trim: true,
    required: [true, "Revenue is required!"]    
},
grossProfit:{
    type: Number,
    trim: true,
    required: [true, "Gross profit is required!"]
},
netProfit:{
    type: Number,   
    trim: true,
    required: [true, "Net profit is required!"]
},
operatingExpenses:{
    type: Number,
    trim: true,
    required: [true, "Operating expenses is required!"]
},
cogs:{
    type: Number,   
    trim: true,
    required: [true, "Cost of goods sold is required!"]
},
avgInventory:{
    type: Number,
    trim: true,
    required: [true, "Average inventory is required!"]
},
payables:{
    type: Number,
    trim: true,
    required: [true, "Payables is required!"]
},
totalDebt:{
    type: Number,
    trim: true,
    required: [true, "Total debt is required!"] 
},
monthlyCashflows:{
    type: [Number],
    required: [true, "Total debt is required!"]
},
totalEquity:{
    type: Number,
    trim: true,
    required: [true, "Total equity is required!"]
},
ebitda:{
    type: Number,
    trim: true,
    required: [true, "EBITDA is required!"] 
},
interestExpense:{
    type: Number, 
    trim: true,
    required: [true, "Interest expense is required!"]  
},
scoreLH:{
    type: Number,
    trim: true,
    required: [true, "Score LH is required!"]  
},
scorePH:{
    type: Number,   
    trim: true,
    required: [true, "Score PH is required!"]
},
scoreCS:{
    type: Number,    
    trim: true,
    required: [true, "Score CS is required!"]
},
scoreEH:{
    type: Number,    
    trim: true,
    required: [true, "Score EH is required!"]
},
scoreSH:{
    type: Number,   
    trim: true,
    required: [true, "Score SH is required!"]
},
financialHealthScore:{
    type: Number,    
    trim: true,
    required: [true, "Financial health score is required!"]
},




}, { timestamps: true });


export const BusinessFinancial = mongoose.model('BusinessFinancial', businessFinancialSchema);