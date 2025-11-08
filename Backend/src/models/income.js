const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  source: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, trim: true },
  frequency: {
    type: String,
    enum: ['one-time', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  }
}, { timestamps: true });

module.exports = mongoose.model('Income', IncomeSchema);
