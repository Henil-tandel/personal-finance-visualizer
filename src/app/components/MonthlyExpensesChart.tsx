'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

interface Transaction {
  amount: number;
  date: string;
}

interface MonthlyTotal {
  month: string;
  amount: number;
}

export default function MonthlyExpensesChart({ refreshFlag }: { refreshFlag: boolean }) {
  const [chartData, setChartData] = useState<MonthlyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  const groupByMonth = (transactions: Transaction[]): MonthlyTotal[] => {
    const monthlyTotals: { [key: string]: number } = {};

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const monthKey = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric'
      }).format(date);
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + tx.amount;
    });

    return Object.entries(monthlyTotals)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime());
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setChartData(groupByMonth(data));
      setLoading(false);
    };
    fetchData();
  }, [refreshFlag]);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Monthly Expenses</h2>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
