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
import type { Currency, Liability } from "@/lib/types"
import { Plus, Edit2 } from "lucide-react"

interface AddLiabilityDialogProps {
  liability?: Liability
  onClose?: () => void
}

export function AddLiabilityDialog({ liability, onClose }: AddLiabilityDialogProps) {
  const { addLiability, updateLiability } = useFinancial()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: liability?.name || "",
    type: (liability?.type || "loan") as "loan" | "mortgage" | "other",
    amount: liability?.amount.toString() || "",
    currency: (liability?.currency || "LKR") as Currency,
    interestRate: liability?.interestRate.toString() || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (liability) {
      updateLiability(liability.id, {
        name: formData.name,
        type: formData.type,
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        interestRate: Number.parseFloat(formData.interestRate),
        date: liability.date,
      })
    } else {
      addLiability({
        name: formData.name,
        type: formData.type,
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        interestRate: Number.parseFloat(formData.interestRate),
        date: new Date().toISOString(),
      })
    }
    setFormData({
      name: "",
      type: "loan",
      amount: "",
      currency: "LKR",
      interestRate: "",
    })
    setOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {liability ? (
          <Button variant="ghost" size="icon" className="hover:bg-chart-5/10 hover:text-chart-5">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Liability
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{liability ? "Edit Liability" : "Add Liability"}</DialogTitle>
            <DialogDescription>
              {liability ? "Update your liability details" : "Add a new liability to track your debts"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Car Loan, Home Mortgage"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: typeof formData.type) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loan">Loan</SelectItem>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{liability ? "Update Liability" : "Add Liability"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
