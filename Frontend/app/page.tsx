"use client"

import { useFinancial } from "@/lib/financial-context"
import { StatCard } from "@/components/stat-card"
import { AreaChart } from "@/components/area-chart"
import { SectionPieChart } from "@/components/section-pie-chart"
import { SalaryBreakdownChart } from "@/components/salary-breakdown-chart"
import { IncomeExpenseChart } from "@/components/income-expense-chart"
import { LiabilitiesChart } from "@/components/liabilities-chart"
import { WealthScoreCompact } from "@/components/wealth-score-compact"
import { TrendingUp, Building2, AlertCircle, CreditCard, Wallet, PiggyBank, DollarSign } from "lucide-react"
import { convertToLKR, formatLKR } from "@/lib/currency-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { calculateWealthScore } from "@/lib/wealth-score"

export default function DashboardPage() {
  const { data } = useFinancial()

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
  const creditUtilization = totalCreditLimit > 0 ? (totalCreditCardDebt / totalCreditLimit) * 100 : 0

  const monthlySalary = data.income
    .filter((item) => item.frequency === "monthly")
    .reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)

  const salaryBreakdown = [
    { name: "Gross Salary", amount: monthlySalary, color: "#ef4444" },
    { name: "Taxes (15%)", amount: monthlySalary * 0.15, color: "#10b981" },
    { name: "Savings (20%)", amount: monthlySalary * 0.2, color: "#3b82f6" },
    { name: "Expenses (50%)", amount: monthlySalary * 0.5, color: "#f59e0b" },
    { name: "Discretionary (15%)", amount: monthlySalary * 0.15, color: "#ec4899" },
  ]

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const incomeExpenseTrend = months.map((month, index) => ({
    month,
    income: totalIncome * (0.85 + index * 0.03),
    expenses: totalIncome * (0.6 + index * 0.02),
    savings: totalIncome * (0.25 + index * 0.01),
  }))

  const assetsByType = data.assets.reduce(
    (acc, asset) => {
      const existing = acc.find((item) => item.name === asset.type)
      const value = convertToLKR(asset.value, asset.currency)
      if (existing) {
        existing.value += value
      } else {
        acc.push({ name: asset.type, value })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const liabilitiesByType = data.liabilities.reduce(
    (acc, liability) => {
      const existing = acc.find((item) => item.name === liability.type)
      const value = convertToLKR(liability.amount, liability.currency)
      if (existing) {
        existing.value += value
      } else {
        acc.push({ name: liability.type, value })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const incomeBySource = data.income.map((item) => ({
    name: item.source,
    value: convertToLKR(item.amount, item.currency),
  }))

  const netWorthTrend = [
    { name: "Jan", value: netWorth * 0.7 },
    { name: "Feb", value: netWorth * 0.75 },
    { name: "Mar", value: netWorth * 0.8 },
    { name: "Apr", value: netWorth * 0.85 },
    { name: "May", value: netWorth * 0.9 },
    { name: "Jun", value: netWorth },
  ]

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalLiabilities) / totalIncome) * 100 : 0
  const monthlyExpenses = totalIncome * 0.65

  const wealthScore = calculateWealthScore(data)
  const hasFinancialData = data.income.length > 0 || data.assets.length > 0

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent">
          WealthTrack Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">
          Comprehensive overview of your financial health and wealth management
        </p>
      </div>

      {hasFinancialData && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left Sidebar - Wealth Score */}
          <div>
            <WealthScoreCompact scoreResult={wealthScore} />
          </div>

          {/* Right Content - Stats Grid */}
          <div className="space-y-4 sm:space-y-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <StatCard title="Total Income" value={formatLKR(totalIncome)} icon={TrendingUp} trend="+12.5%" />
              <StatCard title="Total Assets" value={formatLKR(totalAssets)} icon={Building2} trend="+8.2%" />
              <StatCard
                title="Total Liabilities"
                value={formatLKR(totalLiabilities)}
                icon={AlertCircle}
                trend="-3.1%"
              />
              <StatCard
                title="Credit Card Debt"
                value={formatLKR(totalCreditCardDebt)}
                icon={CreditCard}
                trend="-5.4%"
              />
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                  <Wallet className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{formatLKR(netWorth)}</div>
                  <p className="text-xs text-muted-foreground mt-2">Assets - Liabilities</p>
                  <Progress value={75} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="border-success/30 bg-gradient-to-br from-success/10 via-success/5 to-transparent shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                  <PiggyBank className="h-5 w-5 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-success">{savingsRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-2">Of total income</p>
                  <Progress value={savingsRate} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="border-warning/30 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                  <DollarSign className="h-5 w-5 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-warning">{formatLKR(monthlyExpenses)}</div>
                  <p className="text-xs text-muted-foreground mt-2">Average per month</p>
                  <Progress value={65} className="mt-3 h-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {!hasFinancialData && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Income" value={formatLKR(totalIncome)} icon={TrendingUp} trend="+12.5%" />
          <StatCard title="Total Assets" value={formatLKR(totalAssets)} icon={Building2} trend="+8.2%" />
          <StatCard title="Total Liabilities" value={formatLKR(totalLiabilities)} icon={AlertCircle} trend="-3.1%" />
          <StatCard title="Credit Card Debt" value={formatLKR(totalCreditCardDebt)} icon={CreditCard} trend="-5.4%" />
        </div>
      )}

      {monthlySalary > 0 && (
        <SalaryBreakdownChart data={salaryBreakdown} title="Monthly Salary Breakdown & Allocation" />
      )}

      {totalIncome > 0 && (
        <IncomeExpenseChart data={incomeExpenseTrend} title="6-Month Income, Expenses & Savings Trend" />
      )}

      {netWorth > 0 && <AreaChart title="Net Worth Growth Trend (6 Months)" data={netWorthTrend} color="#fbbf24" />}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {assetsByType.length > 0 && (
          <SectionPieChart
            title="Assets Distribution by Type"
            data={assetsByType}
            colors={["#ef4444", "#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#f97316", "#8b5cf6", "#06b6d4"]}
          />
        )}
        {incomeBySource.length > 0 && (
          <SectionPieChart
            title="Income Sources Breakdown"
            data={incomeBySource}
            colors={["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#f97316", "#8b5cf6", "#06b6d4", "#ef4444"]}
          />
        )}
      </div>

      {liabilitiesByType.length > 0 && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <LiabilitiesChart data={liabilitiesByType} title="Liabilities Overview by Type" />
          <SectionPieChart title="Liabilities Distribution" data={liabilitiesByType} colors={["#ef4444", "#10b981"]} />
        </div>
      )}

      {data.creditCards.length > 0 && (
        <SectionPieChart
          title="Credit Cards Overview"
          data={data.creditCards.map((card) => ({
            name: `${card.bank} ****${card.lastFourDigits}`,
            value: convertToLKR(card.outstanding, card.currency),
          }))}
          colors={["#3b82f6", "#f59e0b", "#ec4899", "#f97316", "#8b5cf6", "#06b6d4", "#ef4444", "#10b981"]}
        />
      )}

      {data.assets.length > 0 && data.liabilities.length > 0 && data.income.length > 0 && (
        <SectionPieChart
          title="Complete Wealth Overview"
          data={[
            { name: "Total Assets", value: totalAssets },
            { name: "Total Liabilities", value: totalLiabilities },
            { name: "Total Income", value: totalIncome },
            { name: "Credit Card Debt", value: totalCreditCardDebt },
          ]}
          colors={["#10b981", "#ef4444", "#3b82f6", "#f59e0b"]}
        />
      )}

      {!hasFinancialData && (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-12">
              <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-semibold mb-2">Welcome to WealthTrack!</p>
              <p className="text-base">
                Add your income and assets to see comprehensive financial analytics, detailed salary breakdowns, and
                personalized insights
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}