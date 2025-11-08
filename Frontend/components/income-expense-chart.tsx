"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface IncomeExpenseChartProps {
  data: Array<{ month: string; income: number; expenses: number; savings: number }>
  title?: string
}

export function IncomeExpenseChart({ data, title = "Income vs Expenses" }: IncomeExpenseChartProps) {
  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  const axisColor = isDark ? "#ffffff" : "#000000"
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: axisColor, fontSize: 12 }}
              axisLine={{ stroke: axisColor }}
            />
            <YAxis className="text-xs" tick={{ fill: axisColor, fontSize: 12 }} axisLine={{ stroke: axisColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: "12px",
              }}
              itemStyle={{
                fontSize: "14px",
                fontWeight: "500",
              }}
              labelStyle={{
                color: "hsl(var(--muted-foreground))",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }} iconType="circle" />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2 }}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#ef4444", strokeWidth: 2 }}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
