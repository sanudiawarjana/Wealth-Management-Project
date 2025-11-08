const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  value: { type: Number, required: true },
  currency: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);