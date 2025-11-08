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
import type { Currency, Asset } from "@/lib/types"
import { Plus, Edit2 } from "lucide-react"

interface AddAssetDialogProps {
  asset?: Asset
  onClose?: () => void
}

export function AddAssetDialog({ asset, onClose }: AddAssetDialogProps) {
  const { addAsset, updateAsset } = useFinancial()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: asset?.name || "",
    type: (asset?.type || "savings") as "property" | "investment" | "savings" | "other",
    value: asset?.value.toString() || "",
    currency: (asset?.currency || "LKR") as Currency,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (asset) {
      updateAsset(asset.id, {
        name: formData.name,
        type: formData.type,
        value: Number.parseFloat(formData.value),
        currency: formData.currency,
        date: asset.date,
      })
    } else {
      addAsset({
        name: formData.name,
        type: formData.type,
        value: Number.parseFloat(formData.value),
        currency: formData.currency,
        date: new Date().toISOString(),
      })
    }
    setFormData({
      name: "",
      type: "savings",
      value: "",
      currency: "LKR",
    })
    setOpen(false)
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {asset ? (
          <Button variant="ghost" size="icon" className="hover:bg-chart-2/10 hover:text-chart-2">
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{asset ? "Edit Asset" : "Add Asset"}</DialogTitle>
            <DialogDescription>
              {asset ? "Update your asset details" : "Add a new asset to track your wealth"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Savings Account, House, Stocks"
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
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
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
          </div>
          <DialogFooter>
            <Button type="submit">{asset ? "Update Asset" : "Add Asset"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
