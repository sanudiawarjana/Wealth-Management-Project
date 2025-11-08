import type { FinancialData, Recommendation } from "./types"
import { convertToLKR } from "./currency-utils"

export function generateRecommendations(data: FinancialData): Omit<Recommendation, "id" | "createdAt">[] {
  const recommendations: Omit<Recommendation, "id" | "createdAt">[] = []

  // Calculate financial metrics
  const totalIncome = data.income.reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)

  const totalAssets = data.assets.reduce((sum, item) => sum + convertToLKR(item.value, item.currency), 0)

  const totalLiabilities = data.liabilities.reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)

  const totalCreditCardDebt = data.creditCards.reduce(
    (sum, card) => sum + convertToLKR(card.outstanding, card.currency),
    0,
  )

  const savingsAssets = data.assets
    .filter((asset) => asset.type === "savings")
    .reduce((sum, item) => sum + convertToLKR(item.value, item.currency), 0)

  // Emergency fund recommendation
  const monthlyIncome = data.income
    .filter((item) => item.frequency === "monthly")
    .reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)

  const emergencyFundTarget = monthlyIncome * 6
  if (savingsAssets < emergencyFundTarget) {
    recommendations.push({
      title: "Build Your Emergency Fund",
      description: `You should aim for ${(emergencyFundTarget / 1000000).toFixed(2)}M LKR (6 months of expenses) in liquid savings. Currently at ${(savingsAssets / 1000000).toFixed(2)}M LKR.`,
      category: "savings",
      status: "pending",
    })
  }

  // High-interest debt recommendation
  const highInterestDebts = data.liabilities.filter((liability) => liability.interestRate > 10)
  if (highInterestDebts.length > 0) {
    const totalHighInterest = highInterestDebts.reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)
    recommendations.push({
      title: "Pay Down High-Interest Debt",
      description: `You have ${(totalHighInterest / 1000000).toFixed(2)}M LKR in debt with interest rates above 10%. Focus on paying these off first to save on interest.`,
      category: "debt",
      status: "pending",
    })
  }

  // Credit card utilization recommendation
  data.creditCards.forEach((card) => {
    const utilization = (card.outstanding / card.limit) * 100
    if (utilization > 30) {
      recommendations.push({
        title: `Reduce ${card.bank} Credit Card Usage`,
        description: `Your ${card.bank} card (••${card.lastFourDigits}) has ${utilization.toFixed(1)}% utilization. Keep it below 30% to maintain a good credit score.`,
        category: "spending",
        status: "pending",
      })
    }
  })

  // Investment diversification recommendation
  const investmentAssets = data.assets.filter((asset) => asset.type === "investment")
  if (totalAssets > 0 && investmentAssets.length === 0) {
    recommendations.push({
      title: "Start Investing for Growth",
      description:
        "You have assets but no investments. Consider diversifying into stocks, bonds, or mutual funds to grow your wealth over time.",
      category: "investment",
      status: "pending",
    })
  }

  // Debt-to-income ratio recommendation
  if (totalIncome > 0) {
    const debtToIncomeRatio = ((totalLiabilities + totalCreditCardDebt) / totalIncome) * 100
    if (debtToIncomeRatio > 40) {
      recommendations.push({
        title: "Improve Your Debt-to-Income Ratio",
        description: `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(1)}%. Aim to keep it below 40% by increasing income or reducing debt.`,
        category: "debt",
        status: "pending",
      })
    }
  }

  // Savings rate recommendation
  if (totalIncome > 0 && savingsAssets > 0) {
    const savingsRate = (savingsAssets / totalIncome) * 100
    if (savingsRate < 20) {
      recommendations.push({
        title: "Increase Your Savings Rate",
        description: `Try to save at least 20% of your income. Currently saving ${savingsRate.toFixed(1)}%. Consider automating transfers to savings accounts.`,
        category: "savings",
        status: "pending",
      })
    }
  }

  // Net worth growth recommendation
  const netWorth = totalAssets - totalLiabilities - totalCreditCardDebt
  if (netWorth < 0) {
    recommendations.push({
      title: "Focus on Building Positive Net Worth",
      description:
        "Your liabilities exceed your assets. Prioritize debt reduction and asset building to achieve financial stability.",
      category: "debt",
      status: "pending",
    })
  }

  return recommendations
}
