"use client"

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AreaChartProps {
  title: string
  data: { name: string; value: number }[]
  color?: string
}

export function AreaChart({ title, data, color = "#fbbf24" }: AreaChartProps) {
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
          <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="50%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              className="text-xs"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              axisLine={{ stroke: axisColor }}
            />
            <YAxis
              className="text-xs"
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 12 }}
              axisLine={{ stroke: axisColor }}
            />
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
              labelStyle={{
                color: "hsl(var(--muted-foreground))",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#gradient-${title})`}
              strokeWidth={2.5}
              animationDuration={1000}
            />
          </RechartsAreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
