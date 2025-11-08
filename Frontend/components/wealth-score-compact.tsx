"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award } from "lucide-react"
import type { WealthScoreResult } from "@/lib/wealth-score"

interface WealthScoreCompactProps {
  scoreResult: WealthScoreResult
}

export function WealthScoreCompact({ scoreResult }: WealthScoreCompactProps) {
  const { totalScore, maxScore, percentage, grade, factors } = scoreResult

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "from-success/20 to-success/5 border-success/30"
    if (grade.startsWith("B")) return "from-info/20 to-info/5 border-info/30"
    if (grade.startsWith("C")) return "from-warning/20 to-warning/5 border-warning/30"
    return "from-destructive/20 to-destructive/5 border-destructive/30"
  }

  const getGradeTextColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-success"
    if (grade.startsWith("B")) return "text-info"
    if (grade.startsWith("C")) return "text-warning"
    return "text-destructive"
  }

  return (
    <Card className={`bg-gradient-to-br ${getGradeColor(grade)} shadow-lg sticky top-4`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Wealth Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Display */}
        <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-primary">{totalScore}</span>
            <span className="text-lg text-muted-foreground">/ {maxScore}</span>
          </div>
          <Badge variant="outline" className={`${getGradeTextColor(grade)} border-current text-lg px-3 py-1`}>
            Grade {grade}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{percentage.toFixed(0)}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Quick Factor Overview */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">Key Factors</div>
          {factors.slice(0, 3).map((factor, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-foreground truncate flex-1">{factor.name}</span>
              <div className="flex items-center gap-2">
                <Progress value={(factor.score / factor.maxScore) * 100} className="h-1.5 w-12" />
                <span className="font-medium text-muted-foreground w-8 text-right">
                  {factor.score}/{factor.maxScore}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tip */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground leading-relaxed">
              {percentage >= 80
                ? "Excellent financial health! Keep it up."
                : percentage >= 60
                  ? "Good progress. Focus on debt reduction."
                  : "Improve by increasing savings rate."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
