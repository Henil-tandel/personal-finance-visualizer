'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TransactionForm from './TransactionForm';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface Props {
  refreshFlag: boolean;
  onUpdateSuccess: () => void;
}

export default function TransactionList({ refreshFlag, onUpdateSuccess }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Transaction | null>(null);

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
      onUpdateSuccess(); // 🔁 Trigger global refresh
      toast.success('Transaction deleted.');
    } else {
      toast.error('Failed to delete transaction.');
    }
  };

  const handleUpdateSuccess = () => {
    fetchData();
    onUpdateSuccess(); // 🔁 Trigger global refresh
    setEditing(null);
  };

  useEffect(() => {
    fetchData();
  }, [refreshFlag]);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-700">📋 Transactions</h2>

      {editing && (
        <TransactionForm
          editingTransaction={editing}
          onSuccess={handleUpdateSuccess}
          onCancelEdit={() => setEditing(null)}
        />
      )}

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
                ₹{tx.amount} | {tx.category} | {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(tx)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(tx._id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
