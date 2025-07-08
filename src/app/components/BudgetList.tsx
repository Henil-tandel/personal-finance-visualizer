'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Budget {
    _id: string;
    category: string;
    amount: number;
    month: string;
}

export default function BudgetList({ refreshFlag }: { refreshFlag: boolean }) {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Budget>>({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/budgets');
                const data = await res.json();

                // ✅ Make sure it's an array
                if (Array.isArray(data)) {
                    setBudgets(data);
                } else if (data?.budgets && Array.isArray(data.budgets)) {
                    setBudgets(data.budgets); // In case it's wrapped in { budgets: [...] }
                } else {
                    console.error('Unexpected data format:', data);
                    setBudgets([]); // prevent crash
                }

                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch budgets:', err);
                setBudgets([]);
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshFlag]);


    const handleEdit = (budget: Budget) => {
        setEditingId(budget._id);
        setEditForm({ ...budget });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const res = await fetch('/api/budgets', {
            method: 'POST',
            body: JSON.stringify(editForm),
        });

        if (res.ok) {
            toast.success('Budget updated');
            setEditingId(null);
            setEditForm({});
            const updated = await res.json();
            setBudgets(prev => prev.map(b => (b._id === updated._id ? updated : b)));
        } else {
            toast.error('Failed to update budget');
        }
    };

    if (loading) return <p>Loading budgets...</p>;

    return (
        <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-800">📊 Monthly Budgets</h2>
            {budgets.length === 0 ? (
                <p>No budgets set.</p>
            ) : (
                budgets.map(budget =>
                    editingId === budget._id ? (
                        <Card key={budget._id} className="p-4 space-y-2 border">
                            <Input
                                name="category"
                                value={editForm.category || ''}
                                onChange={handleChange}
                                placeholder="Category"
                            />
                            <Input
                                name="amount"
                                type="number"
                                value={editForm.amount || ''}
                                onChange={handleChange}
                                placeholder="Amount"
                            />
                            <Input
                                name="month"
                                value={editForm.month || ''}
                                onChange={handleChange}
                                placeholder="Month (e.g., Jul 2025)"
                            />
                            <div className="flex gap-2 mt-2">
                                <Button onClick={handleSave}>Save</Button>
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card key={budget._id} className="p-4 flex justify-between items-center border">
                            <div>
                                <p className="text-gray-800 font-medium">{budget.category}</p>
                                <p className="text-sm text-gray-500">Month: {budget.month}</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <p className="text-gray-800 font-bold">₹{budget.amount}</p>
                                <Button size="sm" variant="outline" onClick={() => handleEdit(budget)}>
                                    Edit
                                </Button>
                            </div>
                        </Card>
                    )
                )
            )}
        </div>
    );
}
