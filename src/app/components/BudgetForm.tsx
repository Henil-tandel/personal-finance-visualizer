'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const months = [...Array(12)].map((_, i) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(
    new Date(new Date().getFullYear(), i)
  )
);

export default function BudgetForm({ onSuccess }: { onSuccess: () => void }) {
  const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date());

  const [month, setMonth] = useState(currentMonth);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      const res = await fetch(`/api/budgets?month=${month}`);
      const data = await res.json();
      if (data?.amount) setAmount(data.amount);
      else setAmount(0);
    };
    fetchBudget();
  }, [month]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/budgets', {
      method: 'POST',
      body: JSON.stringify({ month, amount }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success('Budget saved');
      onSuccess();
    } else {
      toast.error('Failed to save budget');
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">📅 Set Monthly Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Month</Label>
            <select
              className="w-full border rounded px-3 py-2"
              value={month}
              onChange={e => setMonth(e.target.value)}
            >
              {months.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Budget Amount (₹)</Label>
            <Input
              type="number"
              value={isNaN(amount) ? '' : amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Budget'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
