"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react"
import type { WealthScoreResult, WealthScoreFactor } from "@/lib/wealth-score"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WealthScoreCardProps {
  scoreResult: WealthScoreResult
}

export function WealthScoreCard({ scoreResult }: WealthScoreCardProps) {
  const { totalScore, maxScore, percentage, grade, factors, recommendations } = scoreResult

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-success"
    if (grade.startsWith("B")) return "text-info"
    if (grade.startsWith("C")) return "text-warning"
    return "text-destructive"
  }

  const getStatusColor = (status: WealthScoreFactor["status"]) => {
    switch (status) {
      case "excellent":
        return "bg-success/10 text-success border-success/20"
      case "good":
        return "bg-info/10 text-info border-info/20"
      case "fair":
        return "bg-warning/10 text-warning border-warning/20"
      case "poor":
        return "bg-destructive/10 text-destructive border-destructive/20"
    }
  }

  const getStatusIcon = (status: WealthScoreFactor["status"]) => {
    switch (status) {
      case "excellent":
      case "good":
        return <TrendingUp className="h-4 w-4" />
      case "fair":
        return <Minus className="h-4 w-4" />
      case "poor":
        return <TrendingDown className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Your Wealth Score</CardTitle>
            <CardDescription className="mt-1">
              Comprehensive analysis of your financial health across 6 key factors
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Your Wealth Score is calculated based on net worth, debt management, savings rate, asset
                  diversification, credit utilization, and income stability.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Overall Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary">{totalScore}</span>
              <span className="text-2xl text-muted-foreground">/ {maxScore}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">{percentage.toFixed(1)}%</span>
              <Badge variant="outline" className={`${getGradeColor(grade)} border-current`}>
                Grade: {grade}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold opacity-20">{grade}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Perfect Score</span>
            <span className="font-medium">{percentage.toFixed(0)}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        {/* Factor Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Score Breakdown</h3>
          <div className="grid gap-3">
            {factors.map((factor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{factor.name}</span>
                    <Badge variant="outline" className={getStatusColor(factor.status)}>
                      {getStatusIcon(factor.status)}
                      <span className="ml-1 capitalize">{factor.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold">
                    {factor.score}/{factor.maxScore}
                  </div>
                  <Progress value={(factor.score / factor.maxScore) * 100} className="h-2 w-20 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recommendations to Improve Your Score
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span className="text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
