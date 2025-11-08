function buildFinancialAdvicePrompt(snapshot) {
  const { assets, incomes, liabilities, creditCards, metrics } = snapshot;

  const lines = [
    'You are a helpful financial assistant. Provide general, simple financial advice.',
    'You are not a financial advisor. Include a short disclaimer at the end.',
    'Be concise. Use bullet points. Prioritize biggest impact actions first.',
    '',
    'DATA SNAPSHOT (currency values may vary, give currency-agnostic advice):',
    `- Total Assets: ${metrics.totalAssetValue}`,
    `- Total Liabilities: ${metrics.totalLiabilities}`,
    `- Net Worth: ${metrics.netWorth}`,
    `- Monthly Income (normalized): ${metrics.totalIncomeMonthly}`,
    `- Credit Card Debt: ${metrics.totalCreditCardDebt}`,
    '',
    'Top 5 Assets:',
    ...assets.slice(0, 5).map(a => `  • ${a.name} (${a.type}) = ${a.value}`),
    'Top 5 Liabilities:',
    ...liabilities.slice(0, 5).map(l => `  • ${l.name} (${l.type}) = ${l.amount} @ ${l.interestRate ?? 'n/a'}%`),
    'Incomes:',
    ...incomes.map(i => `  • ${i.source} = ${i.amount} (${i.frequency})`),
    'Credit Cards:',
    ...creditCards.map(c => `  • ${c.bank} ****${c.last4} balance=${c.outstandingBalance} limit=${c.creditLimit}`),
    '',
    'TASK:',
    '1) Provide 5-8 general financial recommendations tailored to this snapshot.',
    '2) Include at least one suggestion on budgeting/saving, debt payoff prioritization, emergency fund, and investment basics.',
    '3) Use plain language. Avoid sensitive personal details.',
    '4) Output JSON with the following shape:\n{ "recommendations": [{ "title": string, "detail": string }], "disclaimer": string }'
  ];

  return lines.join('\n');
}

module.exports = {
  buildFinancialAdvicePrompt
};
