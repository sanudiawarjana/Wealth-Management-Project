const Asset = require('../models/assets');
const Income = require('../models/income');
const Liability = require('../models/liabilities');
const CreditCard = require('../models/creditCards');

function sum(numbers) {
  return numbers.reduce((acc, n) => acc + (Number(n) || 0), 0);
}

/**
 * Load and aggregate all financial data from the database.
 * Returns normalized snapshot and simple derived metrics.
 */
async function loadUserFinancialSnapshot() {
  const [assets, incomes, liabilities, creditCards] = await Promise.all([
    Asset.find().lean().exec(),
    Income.find().lean().exec(),
    Liability.find().lean().exec(),
    CreditCard.find().lean().exec()
  ]);

  const totalAssetValue = sum(assets.map(a => a.value));
  const totalIncomeMonthly = sum(incomes.map(i => normalizeToMonthly(i.amount, i.frequency)));
  const totalLiabilities = sum(liabilities.map(l => l.amount));
  const totalCreditCardDebt = sum(creditCards.map(c => c.outstandingBalance));

  const netWorth = totalAssetValue - totalLiabilities;

  const snapshot = {
    assets,
    incomes,
    liabilities,
    creditCards,
    metrics: {
      totalAssetValue,
      totalIncomeMonthly,
      totalLiabilities,
      totalCreditCardDebt,
      netWorth
    }
  };

  return snapshot;
}

function normalizeToMonthly(amount, frequency) {
  if (!amount) return 0;
  switch (frequency) {
    case 'daily':
      return amount * 30;
    case 'weekly':
      return amount * 4;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
    case 'one-time':
      return amount; // treat as single month benefit
    case 'monthly':
    default:
      return amount;
  }
}

module.exports = {
  loadUserFinancialSnapshot
};


