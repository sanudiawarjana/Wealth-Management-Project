"use client"

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DonutChartProps {
  title: string
  data: { name: string; value: number }[]
}

const COLORS = [
  "hsl(var(--chart-1))" /* Bright Blue */,
  "hsl(var(--chart-2))" /* Bright Green */,
  "hsl(var(--chart-3))" /* Bright Orange */,
  "hsl(var(--chart-4))" /* Bright Pink */,
  "hsl(var(--chart-5))" /* Bright Red */,
  "hsl(var(--chart-6))" /* Bright Yellow */,
  "hsl(var(--chart-7))" /* Bright Cyan */,
  "hsl(var(--chart-8))" /* Bright Purple */,
]

export function DonutChart({ title, data }: DonutChartProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="hsl(var(--background))"
              strokeWidth={3}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={1} />
              ))}
            </Pie>
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
            <Legend
              wrapperStyle={{
                fontSize: "13px",
                paddingTop: "16px",
              }}
              iconType="circle"
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
