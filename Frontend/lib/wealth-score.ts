import type { FinancialData } from "./types"
import { convertToLKR } from "./currency-utils"

export interface WealthScoreFactor {
  name: string
  score: number
  maxScore: number
  description: string
  status: "excellent" | "good" | "fair" | "poor"
}

export interface WealthScoreResult {
  totalScore: number
  maxScore: number
  percentage: number
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F"
  factors: WealthScoreFactor[]
  recommendations: string[]
}

export function calculateWealthScore(data: FinancialData): WealthScoreResult {
  const factors: WealthScoreFactor[] = []

  // Calculate totals in LKR
  const totalIncome = data.income.reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)
  const totalAssets = data.assets.reduce((sum, item) => sum + convertToLKR(item.value, item.currency), 0)
  const totalLiabilities = data.liabilities.reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)
  const totalCreditCardDebt = data.creditCards.reduce(
    (sum, card) => sum + convertToLKR(card.outstanding, card.currency),
    0,
  )
  const totalCreditLimit = data.creditCards.reduce((sum, card) => sum + convertToLKR(card.limit, card.currency), 0)

  const netWorth = totalAssets - totalLiabilities - totalCreditCardDebt
  const totalDebt = totalLiabilities + totalCreditCardDebt

  // Factor 1: Net Worth (25 points)
  let netWorthScore = 0
  let netWorthStatus: WealthScoreFactor["status"] = "poor"
  if (netWorth >= totalIncome * 5) {
    netWorthScore = 25
    netWorthStatus = "excellent"
  } else if (netWorth >= totalIncome * 3) {
    netWorthScore = 20
    netWorthStatus = "good"
  } else if (netWorth >= totalIncome) {
    netWorthScore = 15
    netWorthStatus = "fair"
  } else if (netWorth > 0) {
    netWorthScore = 10
    netWorthStatus = "fair"
  } else {
    netWorthScore = 0
    netWorthStatus = "poor"
  }

  factors.push({
    name: "Net Worth",
    score: netWorthScore,
    maxScore: 25,
    description: `Your net worth is ${netWorth >= 0 ? "positive" : "negative"} at ${Math.abs(netWorth).toLocaleString()} LKR`,
    status: netWorthStatus,
  })

  // Factor 2: Debt-to-Income Ratio (20 points)
  const debtToIncomeRatio = totalIncome > 0 ? (totalDebt / totalIncome) * 100 : 100
  let debtScore = 0
  let debtStatus: WealthScoreFactor["status"] = "poor"
  if (debtToIncomeRatio <= 20) {
    debtScore = 20
    debtStatus = "excellent"
  } else if (debtToIncomeRatio <= 36) {
    debtScore = 15
    debtStatus = "good"
  } else if (debtToIncomeRatio <= 50) {
    debtScore = 10
    debtStatus = "fair"
  } else {
    debtScore = 5
    debtStatus = "poor"
  }

  factors.push({
    name: "Debt Management",
    score: debtScore,
    maxScore: 20,
    description: `Debt-to-income ratio: ${debtToIncomeRatio.toFixed(1)}%`,
    status: debtStatus,
  })

  // Factor 3: Savings Rate (20 points)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalDebt) / totalIncome) * 100 : 0
  let savingsScore = 0
  let savingsStatus: WealthScoreFactor["status"] = "poor"
  if (savingsRate >= 30) {
    savingsScore = 20
    savingsStatus = "excellent"
  } else if (savingsRate >= 20) {
    savingsScore = 15
    savingsStatus = "good"
  } else if (savingsRate >= 10) {
    savingsScore = 10
    savingsStatus = "fair"
  } else {
    savingsScore = 5
    savingsStatus = "poor"
  }

  factors.push({
    name: "Savings Rate",
    score: savingsScore,
    maxScore: 20,
    description: `Saving ${savingsRate.toFixed(1)}% of income`,
    status: savingsStatus,
  })

  // Factor 4: Asset Diversification (15 points)
  const assetTypes = new Set(data.assets.map((a) => a.type))
  let diversificationScore = 0
  let diversificationStatus: WealthScoreFactor["status"] = "poor"
  if (assetTypes.size >= 4) {
    diversificationScore = 15
    diversificationStatus = "excellent"
  } else if (assetTypes.size === 3) {
    diversificationScore = 12
    diversificationStatus = "good"
  } else if (assetTypes.size === 2) {
    diversificationScore = 8
    diversificationStatus = "fair"
  } else if (assetTypes.size === 1) {
    diversificationScore = 4
    diversificationStatus = "fair"
  } else {
    diversificationScore = 0
    diversificationStatus = "poor"
  }

  factors.push({
    name: "Asset Diversification",
    score: diversificationScore,
    maxScore: 15,
    description: `${assetTypes.size} different asset types`,
    status: diversificationStatus,
  })

  // Factor 5: Credit Utilization (10 points)
  const creditUtilization = totalCreditLimit > 0 ? (totalCreditCardDebt / totalCreditLimit) * 100 : 0
  let creditScore = 0
  let creditStatus: WealthScoreFactor["status"] = "poor"
  if (creditUtilization <= 10) {
    creditScore = 10
    creditStatus = "excellent"
  } else if (creditUtilization <= 30) {
    creditScore = 8
    creditStatus = "good"
  } else if (creditUtilization <= 50) {
    creditScore = 5
    creditStatus = "fair"
  } else {
    creditScore = 2
    creditStatus = "poor"
  }

  factors.push({
    name: "Credit Utilization",
    score: creditScore,
    maxScore: 10,
    description: `Using ${creditUtilization.toFixed(1)}% of available credit`,
    status: creditStatus,
  })

  // Factor 6: Income Stability (10 points)
  const incomeSourceCount = data.income.length
  let incomeScore = 0
  let incomeStatus: WealthScoreFactor["status"] = "poor"
  if (incomeSourceCount >= 3) {
    incomeScore = 10
    incomeStatus = "excellent"
  } else if (incomeSourceCount === 2) {
    incomeScore = 7
    incomeStatus = "good"
  } else if (incomeSourceCount === 1) {
    incomeScore = 5
    incomeStatus = "fair"
  } else {
    incomeScore = 0
    incomeStatus = "poor"
  }

  factors.push({
    name: "Income Stability",
    score: incomeScore,
    maxScore: 10,
    description: `${incomeSourceCount} income source${incomeSourceCount !== 1 ? "s" : ""}`,
    status: incomeStatus,
  })

  // Calculate total score
  const totalScore = factors.reduce((sum, factor) => sum + factor.score, 0)
  const maxScore = factors.reduce((sum, factor) => sum + factor.maxScore, 0)
  const percentage = (totalScore / maxScore) * 100

  // Determine grade
  let grade: WealthScoreResult["grade"]
  if (percentage >= 95) grade = "A+"
  else if (percentage >= 90) grade = "A"
  else if (percentage >= 85) grade = "B+"
  else if (percentage >= 80) grade = "B"
  else if (percentage >= 75) grade = "C+"
  else if (percentage >= 70) grade = "C"
  else if (percentage >= 60) grade = "D"
  else grade = "F"

  // Generate recommendations
  const recommendations: string[] = []

  if (netWorthScore < 20) {
    recommendations.push("Focus on building your net worth by increasing assets and reducing liabilities")
  }
  if (debtScore < 15) {
    recommendations.push("Work on reducing your debt-to-income ratio to below 36%")
  }
  if (savingsScore < 15) {
    recommendations.push("Aim to save at least 20% of your income each month")
  }
  if (diversificationScore < 12) {
    recommendations.push("Diversify your assets across different investment types to reduce risk")
  }
  if (creditScore < 8) {
    recommendations.push("Keep credit card utilization below 30% to improve your credit health")
  }
  if (incomeScore < 7) {
    recommendations.push("Consider developing additional income streams for financial stability")
  }

  return {
    totalScore,
    maxScore,
    percentage,
    grade,
    factors,
    recommendations,
  }
}
