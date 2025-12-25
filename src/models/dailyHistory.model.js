import mongoose , {Schema} from "mongoose"

const dailyHistorySchema = new Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  periodType: {
    type: String,
    default: 'daily',
    immutable: true // Ensures this value isn't accidentally changed
  },
  financialData: {
    date: {
      type: Date,
      required: true,
      index: true
    },
    revenue: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    expenses: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    cash: {
      type: Number,
      default: 0
    },
    bankBalance: {
      type: Number,
      default: 0
    },
    accountsReceivable: {
      type: Number,
      default: 0
    },
    payables: {
      type: Number,
      default: 0
    },
    inventory: {
      type: Number,
      default: 0
    }
  },
}, 
{
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

dailyHistorySchema.index(
  // {  "financialData.date": 1 },
  { unique: true }
);

// Virtual field for Net Profit Calculation
dailyHistorySchema.virtual('financialData.netProfit').get(function() {
  return this.financialData.revenue - this.financialData.expenses;
});

export const DailyHistory = mongoose.model('DailyHistory', dailyHistorySchema);

