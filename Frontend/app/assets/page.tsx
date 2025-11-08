"use client"

import { useFinancial } from "@/lib/financial-context"
import { AddAssetDialog } from "@/components/add-asset-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, convertToLKR, formatLKR } from "@/lib/currency-utils"
import { Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AssetsPage() {
  const { data, deleteAsset } = useFinancial()

  const totalAssets = data.assets.reduce((sum, item) => sum + convertToLKR(item.value, item.currency), 0)

  const assetsByType = data.assets.reduce(
    (acc, asset) => {
      const value = convertToLKR(asset.value, asset.currency)
      acc[asset.type] = (acc[asset.type] || 0) + value
      return acc
    },
    {} as Record<string, number>,
  )

  const assetTypeColors: Record<string, string> = {
    cash: "from-green-500 to-emerald-600",
    stocks: "from-blue-500 to-cyan-600",
    property: "from-purple-500 to-pink-600",
    crypto: "from-orange-500 to-amber-600",
    other: "from-gray-500 to-slate-600",
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Track and manage your assets</p>
        </div>
        <AddAssetDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {formatLKR(totalAssets)}
            </div>
          </CardContent>
        </Card>
        {Object.entries(assetsByType).map(([type, value]) => (
          <Card
            key={type}
            className={cn(
              "bg-gradient-to-br border-2 hover:shadow-lg transition-all",
              `${assetTypeColors[type] || assetTypeColors.other}/10`,
              `border-${type === "cash" ? "green" : type === "stocks" ? "blue" : type === "property" ? "purple" : type === "crypto" ? "orange" : "gray"}-500/20`,
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
          <CardTitle>Asset List</CardTitle>
        </CardHeader>
        <CardContent>
          {data.assets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No assets added yet</p>
              <p className="text-sm mt-2">Click "Add Asset" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.assets.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(item.value, item.currency)}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <AddAssetDialog asset={item} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAsset(item.id)}
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
