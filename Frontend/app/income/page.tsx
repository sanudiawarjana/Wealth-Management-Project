"use client"

import { useFinancial } from "@/lib/financial-context"
import { AddIncomeDialog } from "@/components/add-income-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, convertToLKR, formatLKR } from "@/lib/currency-utils"
import { Trash2, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function IncomePage() {
  const { data, deleteIncome } = useFinancial()

  const totalIncome = data.income.reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)

  const monthlyIncome = data.income
    .filter((item) => item.frequency === "monthly")
    .reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)

  const yearlyIncome = data.income
    .filter((item) => item.frequency === "yearly")
    .reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)

  const incomeSourcePercentages = data.income.map((item) => {
    const amount = convertToLKR(item.amount, item.currency)
    return {
      ...item,
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-success to-chart-2 bg-clip-text text-transparent">
            Income Management
          </h1>
          <p className="text-muted-foreground mt-1">Track and manage all your income sources with detailed analytics</p>
        </div>
        <AddIncomeDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-success/30 bg-gradient-to-br from-success/10 to-transparent shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{formatLKR(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">All sources combined</p>
          </CardContent>
        </Card>
        <Card className="border-chart-1/30 bg-gradient-to-br from-chart-1/10 to-transparent shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <Calendar className="h-5 w-5 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-1">{formatLKR(monthlyIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">Recurring monthly</p>
          </CardContent>
        </Card>
        <Card className="border-chart-2/30 bg-gradient-to-br from-chart-2/10 to-transparent shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Yearly Income</CardTitle>
            <TrendingUp className="h-5 w-5 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2">{formatLKR(yearlyIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">Annual earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Income Sources Details</CardTitle>
        </CardHeader>
        <CardContent>
          {data.income.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No income sources added yet</p>
              <p className="text-sm mt-2">Click "Add Income" to start tracking your earnings</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Contribution</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeSourcePercentages.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.source}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(item.amount, item.currency)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {item.frequency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={item.percentage} className="w-20 h-2" />
                        <span className="text-sm font-medium">{item.percentage.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <AddIncomeDialog income={item} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteIncome(item.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
