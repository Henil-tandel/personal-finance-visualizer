'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ amount: '', description: '', date: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    const amt = parseFloat(form.amount);
    const today = new Date().toISOString().split('T')[0];

    if (!form.amount || isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid amount.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.date) errs.date = 'Date is required.';
    else if (form.date > today) errs.date = 'Date cannot be in the future.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const res = await fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    });

    setLoading(false);
    if (res.ok) {
      setForm({ amount: '', description: '', date: '' });
      onSuccess();
      toast.success('✅ Transaction added.');
    } else {
      toast.error('❌ Failed to add transaction.');
    }
  };

  return (
    <Card className="max-w-xl mx-auto shadow-lg border border-gray-200 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">➕ Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g., 500"
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g., Groceries"
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
