import mongoose , {Schema} from "mongoose"


const weeklyHistorySchema = new Schema({
  weekStart: {
    type: Date,
    required: true,
    index: true
  },
  weekEnd: {
    type: Date,
    required: true
  },
  totalRevenue: {
    type: Number,
    required: true,
    default: 0
  },
  totalExpenses: {
    type: Number,
    required: true,
    default: 0
  },
  grossProfit: {
    type: Number,
    required: true
  },
  netProfit: {
    type: Number,
    required: true
  },
  avgDailyRevenue: {
    type: Number,
    default: 0
  },
  inventoryTurnover: {
    type: Number,
    default: 0
  },
  metadata: {
    generatedAt: { type: Date, default: Date.now },
    isFinalized: { type: Boolean, default: false } // True if the week is over
  }
}, {
  timestamps: true
});

// Ensure we don't have duplicate records for the same week start date
// weeklyHistorySchema.index({ weekStart: 1 }, { unique: true });

export const WeeklyHistory = mongoose.model('WeeklyHistory', weeklyHistorySchema);

