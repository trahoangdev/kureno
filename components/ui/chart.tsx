"use client"

import type React from "react"
import {
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

interface ChartContainerProps {
  data: any[]
  xAxisDataKey: string
  series: {
    dataKey: string
    label: string
    color: string
    area?: boolean
  }[]
  children: React.ReactNode
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ data, xAxisDataKey, series, children }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  )
}

interface ChartTooltipProps {
  formatter?: (value: any, name: string) => string | number | React.ReactNode
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ formatter }) => {
  return <Tooltip formatter={formatter} />
}

type LineChartProps = {}

export const LineChart: React.FC<LineChartProps> = () => {
  return (
    <RechartsLineChart data={[]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="total" stroke="#8884d8" />
    </RechartsLineChart>
  )
}
