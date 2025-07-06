'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
}

export default function TransactionList({ refreshFlag }: { refreshFlag: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchData();
      toast.success('Transaction deleted.');
    } else {
      toast.error('Failed to delete transaction.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshFlag]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">📋 Transactions</h2>
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transactions found.</p>
      ) : (
        transactions.map((tx) => (
          <Card
            key={tx._id}
            className="flex justify-between items-center p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="font-medium text-gray-800">{tx.description}</p>
              <p className="text-sm text-gray-500">
                ₹{tx.amount} on {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
            <Button variant="destructive" onClick={() => handleDelete(tx._id)}>
              Delete
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
