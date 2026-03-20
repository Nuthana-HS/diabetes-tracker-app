'use client';

import { memo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const color = value < 7 ? '#16a34a' : value < 8 ? '#ca8a04' : '#dc2626';
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-bold text-lg" style={{ color }}>{value}%</p>
      <p className="text-xs text-gray-400">
        {value < 7 ? '✓ Good' : value < 8 ? '⚠️ Warning' : '🔴 High'}
      </p>
    </div>
  );
};

const HbA1cChart = memo(function HbA1cChart({ readings, target = 7.0 }) {
  if (!readings || readings.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <p className="text-gray-400 dark:text-gray-500 text-sm">No data to display yet</p>
        <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">
          Add your first HbA1c reading
        </p>
      </div>
    );
  }

  const chartData = [...readings]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10)
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: r.value,
    }));

  const minVal = Math.min(...chartData.map(d => d.value), target) - 0.5;
  const maxVal = Math.max(...chartData.map(d => d.value), target) + 0.5;

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="hba1cGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[Math.max(4, minVal), Math.min(14, maxVal)]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={target}
            stroke="#16a34a"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Target ${target}%`,
              fill: '#16a34a',
              fontSize: 10,
              position: 'right'
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="url(#hba1cGradient)"
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export default HbA1cChart;