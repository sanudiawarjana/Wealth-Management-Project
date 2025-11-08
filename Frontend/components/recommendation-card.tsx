"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Recommendation } from "@/lib/types"
import { Lightbulb, TrendingUp, PiggyBank, AlertCircle, ShoppingCart } from "lucide-react"

interface RecommendationCardProps {
  recommendation: Recommendation
  onStatusChange: (id: string, status: Recommendation["status"]) => void
}

const categoryIcons = {
  savings: PiggyBank,
  investment: TrendingUp,
  debt: AlertCircle,
  spending: ShoppingCart,
}

const categoryColors = {
  savings: "bg-green-500/10 text-green-700 dark:text-green-400",
  investment: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  debt: "bg-red-500/10 text-red-700 dark:text-red-400",
  spending: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
}

const statusColors = {
  pending: "secondary",
  "in-progress": "default",
  completed: "outline",
  dismissed: "outline",
} as const

export function RecommendationCard({ recommendation, onStatusChange }: RecommendationCardProps) {
  const Icon = categoryIcons[recommendation.category]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${categoryColors[recommendation.category]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
            </div>
          </div>
          <Badge variant={statusColors[recommendation.status]} className="capitalize">
            {recommendation.status.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground capitalize">{recommendation.category}</span>
          </div>
          <Select
            value={recommendation.status}
            onValueChange={(value: Recommendation["status"]) => onStatusChange(recommendation.id, value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
