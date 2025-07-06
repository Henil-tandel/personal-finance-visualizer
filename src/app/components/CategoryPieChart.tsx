'use client';

import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Transaction {
  amount: number;
  category: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28', '#00C49F', '#FF69B4'];

export default function CategoryPieChart({ refreshFlag }: { refreshFlag: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      const res = await fetch('/api/transactions');
      const data: Transaction[] = await res.json();
      const grouped: { [category: string]: number } = {};

      data.forEach(tx => {
        grouped[tx.category] = (grouped[tx.category] || 0) + tx.amount;
      });

      const result = Object.entries(grouped).map(([category, total]) => ({
        name: category,
        value: total,
      }));

      setChartData(result);
      setLoading(false);
    };

    fetchData();
  }, [refreshFlag]);

  if (!mounted || loading) return <p>Loading pie chart...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">🧁 Category-wise Spending</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
