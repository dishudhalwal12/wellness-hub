"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type OverviewProps = {
  data: {
    name: string;
    total: number;
  }[];
}

export default function Overview({ data }: OverviewProps) {
  const peakValue = Math.max(...data.map((item) => item.total), 0);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.18)" />
        <XAxis
          dataKey="name"
          stroke="rgba(100, 116, 139, 0.8)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="rgba(100, 116, 139, 0.8)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}`}
        />
        <Tooltip
          cursor={{ fill: 'rgba(17, 138, 178, 0.06)' }}
          contentStyle={{
            borderRadius: 16,
            border: '1px solid rgba(226, 232, 240, 0.9)',
            background: 'rgba(255,255,255,0.96)',
            boxShadow: '0 24px 70px -38px rgba(15,23,42,0.4)',
          }}
          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
        />
        <Bar dataKey="total" radius={[10, 10, 4, 4]}>
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.total === peakValue ? 'hsl(var(--primary))' : 'rgba(17, 138, 178, 0.35)'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
