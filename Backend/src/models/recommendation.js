const mongoose = require('mongoose');

const RecommendationItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  detail: { type: String, required: true }
}, { _id: false });

const RecommendationSchema = new mongoose.Schema({
  snapshotMetrics: {
    totalAssetValue: { type: Number, default: 0 },
    totalIncomeMonthly: { type: Number, default: 0 },
    totalLiabilities: { type: Number, default: 0 },
    totalCreditCardDebt: { type: Number, default: 0 },
    netWorth: { type: Number, default: 0 }
  },
  recommendations: { type: [RecommendationItemSchema], required: true },
  disclaimer: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', RecommendationSchema);


