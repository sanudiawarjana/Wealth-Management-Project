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
import type { Currency, CreditCard } from "@/lib/types"
import { Plus, Edit2 } from "lucide-react"

interface AddCreditCardDialogProps {
  card?: CreditCard
  onClose?: () => void
}

export function AddCreditCardDialog({ card, onClose }: AddCreditCardDialogProps) {
  const { addCreditCard, updateCreditCard } = useFinancial()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    bank: card?.bank || "",
    lastFourDigits: card?.lastFourDigits || "",
    limit: card?.limit.toString() || "",
    outstanding: card?.outstanding.toString() || "",
    currency: (card?.currency || "LKR") as Currency,
    dueDate: card?.dueDate || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (card) {
      updateCreditCard(card.id, {
        bank: formData.bank,
        lastFourDigits: formData.lastFourDigits,
        limit: Number.parseFloat(formData.limit),
        outstanding: Number.parseFloat(formData.outstanding),
        currency: formData.currency,
        dueDate: formData.dueDate,
      })
    } else {
      addCreditCard({
        bank: formData.bank,
        lastFourDigits: formData.lastFourDigits,
        limit: Number.parseFloat(formData.limit),
        outstanding: Number.parseFloat(formData.outstanding),
        currency: formData.currency,
        dueDate: formData.dueDate,
      })
    }
    setFormData({
      bank: "",
      lastFourDigits: "",
      limit: "",
      outstanding: "",
      currency: "LKR",
      dueDate: "",
    })
    setOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {card ? (
          <Button variant="ghost" size="icon" className="hover:bg-chart-4/10 hover:text-chart-4">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Credit Card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{card ? "Edit Credit Card" : "Add Credit Card"}</DialogTitle>
            <DialogDescription>
              {card ? "Update your credit card details" : "Add a new credit card to track your spending"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bank">Bank</Label>
              <Input
                id="bank"
                placeholder="e.g., Commercial Bank, HSBC"
                value={formData.bank}
                onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastFourDigits">Last 4 Digits</Label>
              <Input
                id="lastFourDigits"
                placeholder="1234"
                maxLength={4}
                value={formData.lastFourDigits}
                onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limit">Credit Limit</Label>
              <Input
                id="limit"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outstanding">Outstanding Balance</Label>
              <Input
                id="outstanding"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.outstanding}
                onChange={(e) => setFormData({ ...formData, outstanding: e.target.value })}
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
              <Label htmlFor="dueDate">Payment Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{card ? "Update Credit Card" : "Add Credit Card"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
