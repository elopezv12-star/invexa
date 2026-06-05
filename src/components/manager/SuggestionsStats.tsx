"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface SuggestionsStatsProps {
  accepted: number;
  ignored: number;
  total: number;
}

const COLORS = ["#22c55e", "#ef4444"];

export function SuggestionsStats({
  accepted,
  ignored,
  total,
}: SuggestionsStatsProps) {
  const data = [
    { name: "Aceptadas", value: accepted },
    { name: "Ignoradas", value: ignored },
  ];

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <p className="text-4xl mb-2">🤖</p>
          <p className="text-sm">No hay sugerencias hoy</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-green-50 p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{accepted}</p>
          <p className="text-xs text-green-600">Aceptadas</p>
        </div>
        <div className="rounded-xl bg-red-50 p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{ignored}</p>
          <p className="text-xs text-red-600">Ignoradas</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-3 text-center">
          <p className="text-2xl font-bold text-brand-700">{total}</p>
          <p className="text-xs text-brand-600">Total</p>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
