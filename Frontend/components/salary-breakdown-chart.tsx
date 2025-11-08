"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"

interface SalaryBreakdownChartProps {
  data: Array<{ name: string; amount: number; color: string }>
  title?: string
}

export function SalaryBreakdownChart({ data, title = "Salary Breakdown" }: SalaryBreakdownChartProps) {
  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  const axisColor = isDark ? "#ffffff" : "#000000"
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"

  const brightColors = [
    "#ef4444", // Red
    "#10b981", // Green
    "#3b82f6", // Blue
    "#f59e0b", // Yellow/Amber
    "#ec4899", // Pink
  ]

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
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
                color: "hsl(var(--foreground))",
                fontSize: "14px",
                fontWeight: "500",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "16px" }} iconType="circle" />
            <Bar dataKey="amount" radius={[10, 10, 0, 0]} animationDuration={800}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={brightColors[index % brightColors.length]} opacity={1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
