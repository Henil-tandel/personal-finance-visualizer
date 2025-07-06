'use client';

import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import MonthlyExpensesChart from './components/MonthlyExpensesChart';

export default function Home() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          💸 Personal Finance Visualizer
        </h1>
        <p className="text-gray-500 text-sm">
          Track your transactions and visualize spending over time.
        </p>
      </header>

      {/* Transaction Form */}
      <section className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">➕ Add New Transaction</h2>
        <TransactionForm onSuccess={triggerRefresh} />
      </section>

      {/* Transactions List */}
      <section className="bg-white shadow-md rounded-xl p-6">
        <TransactionList refreshFlag={refreshFlag} />
      </section>

      {/* Monthly Chart */}
      <section className="bg-white shadow-md rounded-xl p-6">
        <MonthlyExpensesChart refreshFlag={refreshFlag} />
      </section>
    </main>
  );
}
