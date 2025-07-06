'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Transaction {
  amount: number;
  description: string;
  date: string;
  category: string;
}

export default function DashboardCards({ refreshFlag }: { refreshFlag: boolean }) {   
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
      setLoading(false);
    };
    fetchData();
  }, [refreshFlag]);

  if (!mounted || loading) return <p>Loading dashboard...</p>;

  const totalExpense = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const categoryTotals: { [category: string]: number } = {};
  transactions.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Total Expenses */}
      <Card className="bg-blue-100">
        <CardContent className="py-4">
          <h2 className="text-xl font-semibold text-blue-800">💰 Total Expenses</h2>
          <p className="text-2xl font-bold text-blue-900 mt-1">₹{totalExpense.toFixed(2)}</p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="bg-purple-100">
        <CardContent className="py-4">
          <h2 className="text-xl font-semibold text-purple-800">🧾 Category Breakdown</h2>
          <ul className="mt-2 space-y-1">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <li key={category} className="text-sm text-purple-900">
                {category}: ₹{amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-green-100">
        <CardContent className="py-4">
          <h2 className="text-xl font-semibold text-green-800">🕒 Recent Transactions</h2>
          <ul className="mt-2 space-y-1 text-green-900 text-sm">
            {recentTransactions.map((tx, i) => (
              <li key={i}>
                • ₹{tx.amount} - {tx.description} ({tx.category}) on{' '}
                {mounted ? new Date(tx.date).toLocaleDateString() : ''}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
