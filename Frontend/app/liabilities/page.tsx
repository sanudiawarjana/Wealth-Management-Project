"use client"

import { useFinancial } from "@/lib/financial-context"
import { AddLiabilityDialog } from "@/components/add-liability-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, convertToLKR, formatLKR } from "@/lib/currency-utils"
import { Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function LiabilitiesPage() {
  const { data, deleteLiability } = useFinancial()

  const totalLiabilities = data.liabilities.reduce((sum, item) => sum + convertToLKR(item.amount, item.currency), 0)

  const liabilitiesByType = data.liabilities.reduce(
    (acc, liability) => {
      const value = convertToLKR(liability.amount, liability.currency)
      acc[liability.type] = (acc[liability.type] || 0) + value
      return acc
    },
    {} as Record<string, number>,
  )

  const averageInterestRate =
    data.liabilities.length > 0
      ? data.liabilities.reduce((sum, item) => sum + item.interestRate, 0) / data.liabilities.length
      : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liabilities</h1>
          <p className="text-muted-foreground">Track and manage your debts and loans</p>
        </div>
        <AddLiabilityDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/20 hover:shadow-lg hover:shadow-red-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {formatLKR(totalLiabilities)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Interest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              {averageInterestRate.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
        {Object.entries(liabilitiesByType).map(([type, value], index) => (
          <Card
            key={type}
            className={cn(
              "bg-gradient-to-br border-2 hover:shadow-lg transition-all",
              index % 2 === 0
                ? "from-purple-500/10 to-pink-500/10 border-purple-500/20"
                : "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
            )}
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium capitalize">{type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLKR(value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liability List</CardTitle>
        </CardHeader>
        <CardContent>
          {data.liabilities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No liabilities added yet</p>
              <p className="text-sm mt-2">Click "Add Liability" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.liabilities.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(item.amount, item.currency)}</TableCell>
                    <TableCell>{item.interestRate}%</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <AddLiabilityDialog liability={item} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLiability(item.id)}
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
