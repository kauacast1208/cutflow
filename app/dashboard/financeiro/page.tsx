"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { name: "Seg", faturamento: 400 },
  { name: "Ter", faturamento: 700 },
  { name: "Qua", faturamento: 500 },
  { name: "Qui", faturamento: 900 },
  { name: "Sex", faturamento: 1200 },
  { name: "Sáb", faturamento: 1600 },
  { name: "Dom", faturamento: 800 },
]

export default function FinanceiroPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Financeiro
        </h1>
        <p className="text-zinc-400 mt-2">
          Visão geral do faturamento semanal.
        </p>
      </div>

      <div className="bg-zinc-900/70 backdrop-blur-xl p-6 rounded-2xl border border-zinc-800">

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#71717a" />
            <YAxis stroke="#71717a" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="faturamento"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  )
}
