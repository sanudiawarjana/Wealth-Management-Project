"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts"

interface ChartData {
  name: string
  value: number
}

interface FinancialChartProps {
  title: string
  data: ChartData[]
  dataKey?: string
}

const BAR_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
]

export function FinancialChart({ title, data, dataKey = "value" }: FinancialChartProps) {
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
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: axisColor }}
              tick={{ fill: axisColor }}
            />
            <YAxis
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: axisColor }}
              tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
              tick={{ fill: axisColor }}
            />
            <Tooltip
              formatter={(value: number) => `Rs. ${value.toLocaleString()}`}
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
              labelStyle={{
                color: "hsl(var(--muted-foreground))",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            />
            <Bar dataKey={dataKey} radius={[10, 10, 0, 0]} animationDuration={800}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} opacity={1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
