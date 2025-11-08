const mongoose = require('mongoose');

const CreditCardSchema = new mongoose.Schema({
  bank: { type: String, required: true, trim: true },
  last4: {
    type: String,
    required: true,
    validate: {
      validator: v => /^\d{4}$/.test(v),
      message: props => `${props.value} is not a valid last-4 digits string`
    }
  },
  creditLimit: { type: Number, required: true },
  outstandingBalance: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, trim: true },
  paymentDueDate: { type: Date, required: false }
}, { timestamps: true });

module.exports = mongoose.model('CreditCard', CreditCardSchema);