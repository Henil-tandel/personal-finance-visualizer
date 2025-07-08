'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Transaction {
  amount: number;
  category: string;
  date: string;
}

export default function SpendingInsights({ refreshFlag }: { refreshFlag: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/transactions');
      const data: Transaction[] = await res.json();
      setTransactions(data);
      setLoading(false);
    };
    fetchData();
  }, [refreshFlag]);

  if (loading) return <p>Loading insights...</p>;
  if (transactions.length === 0) return <p>No transactions to show insights.</p>;

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const count = transactions.length;

  const categoryTotals: Record<string, number> = {};
  const monthTotals: Record<string, number> = {};

  transactions.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;

    const month = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
      new Date(tx.date)
    );
    monthTotals[month] = (monthTotals[month] || 0) + tx.amount;
  });

  const topCategory = Object.entries(categoryTotals).reduce((a, b) => (a[1] > b[1] ? a : b));
  const topMonth = Object.entries(monthTotals).reduce((a, b) => (a[1] > b[1] ? a : b));
  const average = total / Object.keys(monthTotals).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">💡 Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-700">
        <p>🧾 Total Transactions: <strong>{count}</strong></p>
        <p>💰 Total Spent: ₹<strong>{total.toFixed(2)}</strong></p>
        <p>📈 Avg Monthly Spend: ₹<strong>{average.toFixed(2)}</strong></p>
        <p>🔥 Top Category: <strong>{topCategory[0]}</strong> (₹{topCategory[1].toFixed(2)})</p>
        <p>📅 Most Expensive Month: <strong>{topMonth[0]}</strong> (₹{topMonth[1].toFixed(2)})</p>
      </CardContent>
    </Card>
  );
}
