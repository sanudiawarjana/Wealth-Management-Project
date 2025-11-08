"use client"

import { useFinancial } from "@/lib/financial-context"
import { AddCreditCardDialog } from "@/components/add-credit-card-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, convertToLKR, formatLKR } from "@/lib/currency-utils"
import { Trash2, CreditCardIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function CreditCardsPage() {
  const { data, deleteCreditCard } = useFinancial()

  const totalLimit = data.creditCards.reduce((sum, card) => sum + convertToLKR(card.limit, card.currency), 0)

  const totalOutstanding = data.creditCards.reduce(
    (sum, card) => sum + convertToLKR(card.outstanding, card.currency),
    0,
  )

  const availableCredit = totalLimit - totalOutstanding
  const utilizationRate = totalLimit > 0 ? (totalOutstanding / totalLimit) * 100 : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Cards</h1>
          <p className="text-muted-foreground">Track and manage your credit cards</p>
        </div>
        <AddCreditCardDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {formatLKR(totalLimit)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-2 border-red-500/20 hover:shadow-lg hover:shadow-red-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              {formatLKR(totalOutstanding)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20 hover:shadow-lg hover:shadow-green-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {formatLKR(availableCredit)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {utilizationRate.toFixed(1)}%
            </div>
            <Progress value={utilizationRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {data.creditCards.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>No credit cards added yet</p>
                <p className="text-sm mt-2">Click "Add Credit Card" to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          data.creditCards.map((card, index) => {
            const utilization = (card.outstanding / card.limit) * 100
            const available = card.limit - card.outstanding
            const dueDate = new Date(card.dueDate)
            const today = new Date()
            const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            const gradients = [
              "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
              "from-purple-500/10 to-pink-500/10 border-purple-500/20",
              "from-green-500/10 to-emerald-500/10 border-green-500/20",
              "from-orange-500/10 to-amber-500/10 border-orange-500/20",
            ]

            return (
              <Card
                key={card.id}
                className={cn(
                  "bg-gradient-to-br border-2 hover:shadow-lg transition-all",
                  gradients[index % gradients.length],
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                        <CreditCardIcon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{card.bank}</CardTitle>
                        <p className="text-sm text-muted-foreground">•••• {card.lastFourDigits}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AddCreditCardDialog card={card} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCreditCard(card.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Limit</p>
                      <p className="text-lg font-semibold">{formatCurrency(card.limit, card.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                      <p className="text-lg font-semibold">{formatCurrency(card.outstanding, card.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-lg font-semibold">{formatCurrency(available, card.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Due</p>
                      <p className="text-lg font-semibold">{daysUntilDue > 0 ? `${daysUntilDue} days` : "Overdue"}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Utilization</p>
                      <p className="text-sm font-medium">{utilization.toFixed(1)}%</p>
                    </div>
                    <Progress value={utilization} />
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
