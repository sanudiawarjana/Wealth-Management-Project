const mongoose = require('mongoose');

const LiabilitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, trim: true },
  interestRate: { type: Number, required: false } // store as percent (e.g. 4.5)
}, { timestamps: true });

module.exports = mongoose.model('Liability', LiabilitySchema);