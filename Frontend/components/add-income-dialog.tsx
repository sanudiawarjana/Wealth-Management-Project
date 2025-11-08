"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinancial } from "@/lib/financial-context"
import type { Currency, Income } from "@/lib/types"
import { Plus, Edit2 } from "lucide-react"

interface AddIncomeDialogProps {
  income?: Income
  onClose?: () => void
}

export function AddIncomeDialog({ income, onClose }: AddIncomeDialogProps) {
  const { addIncome, updateIncome } = useFinancial()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    source: income?.source || "",
    amount: income?.amount.toString() || "",
    currency: (income?.currency || "LKR") as Currency,
    frequency: (income?.frequency || "monthly") as "monthly" | "yearly" | "one-time",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (income) {
      updateIncome(income.id, {
        source: formData.source,
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        frequency: formData.frequency,
        date: income.date,
      })
    } else {
      addIncome({
        source: formData.source,
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        frequency: formData.frequency,
        date: new Date().toISOString(),
      })
    }
    setFormData({
      source: "",
      amount: "",
      currency: "LKR",
      frequency: "monthly",
    })
    setOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {income ? (
          <Button variant="ghost" size="icon" className="hover:bg-chart-1/10 hover:text-chart-1">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{income ? "Edit Income Source" : "Add Income Source"}</DialogTitle>
            <DialogDescription>
              {income ? "Update your income source details" : "Add a new income source to track your earnings"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="e.g., Salary, Freelance, Investment"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value: Currency) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LKR">LKR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: "monthly" | "yearly" | "one-time") =>
                  setFormData({ ...formData, frequency: value })
                }
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{income ? "Update Income" : "Add Income"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}