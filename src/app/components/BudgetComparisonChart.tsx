'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Transaction {
  amount: number;
  date: string;
}

interface Budget {
  month: string;
  amount: number;
}

export default function BudgetComparisonChart({ refreshFlag = false }: { refreshFlag?: boolean }) {
  const [data, setData] = useState<{ month: string; budget: number; actual: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombinedData = async () => {
      setLoading(true);
      const txRes = await fetch('/api/transactions');
      const transactions: Transaction[] = await txRes.json();

      const byMonth: Record<string, number> = {};
      transactions.forEach(tx => {
        const key = new Intl.DateTimeFormat('en-US', {
          month: 'short',
          year: 'numeric',
        }).format(new Date(tx.date));
        byMonth[key] = (byMonth[key] || 0) + tx.amount;
      });

      const results = await Promise.all(
        Object.keys(byMonth).map(async month => {
          const res = await fetch(`/api/budgets?month=${month}`);
          const budget: Budget = await res.json();
          return {
            month,
            budget: budget?.amount || 0,
            actual: byMonth[month],
          };
        })
      );

      setData(results);
      setLoading(false);
    };

    fetchCombinedData();
  }, [refreshFlag]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">📈 Budget vs Actual Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
              <Bar dataKey="actual" fill="#8884d8" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
