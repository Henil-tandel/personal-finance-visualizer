'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Props {
  onSuccess: () => void;
  editingTransaction?: Transaction | null;
  onCancelEdit?: () => void;
}

interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

export default function TransactionForm({ onSuccess, editingTransaction, onCancelEdit }: Props) {
  const [form, setForm] = useState<Transaction>({
    amount: 0,
    description: '',
    date: '',
    category: 'Other',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setForm(editingTransaction);
    } else {
      setForm({ amount: 0, description: '', date: '', category: 'Other' });
    }
  }, [editingTransaction]);

  const validate = () => {
    const errs: typeof errors = {};
    const amt = Number(form.amount);
    const today = new Date().toISOString().split('T')[0];

    if (!form.amount || isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid amount.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.date) errs.date = 'Date is required.';
    else if (form.date > today) errs.date = 'Date cannot be in the future.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const method = editingTransaction ? 'PUT' : 'POST';
    const body = JSON.stringify({
      ...form,
      id: editingTransaction?._id,
      amount: parseFloat(form.amount.toString()),
    });

    const res = await fetch('/api/transactions', { method, body });

    setLoading(false);
    if (res.ok) {
      toast.success(editingTransaction ? 'Transaction updated.' : 'Transaction added.');
      setForm({ amount: 0, description: '', date: '', category: 'Other' }); // reset form
      onSuccess();
      onCancelEdit?.(); // go back to add mode
    } else {
      toast.error('Failed to save transaction.');
    }
  };

  return (
    <Card className="max-w-xl mx-auto shadow-lg border border-gray-200 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">
          {editingTransaction ? '✏️ Edit Transaction' : '➕ Add New Transaction'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input name="amount" type="number" value={form.amount} onChange={handleChange} />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input name="description" value={form.description} onChange={handleChange} />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input name="date" type="date" value={form.date} onChange={handleChange} />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {['Food', 'Transport', 'Utilities', 'Rent', 'Shopping', 'Health', 'Other'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (editingTransaction ? 'Updating...' : 'Adding...') : (editingTransaction ? 'Update' : 'Add')}
            </Button>
            {editingTransaction && (
              <Button variant="ghost" type="button" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
