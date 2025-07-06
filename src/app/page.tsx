'use client';

import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import MonthlyExpensesChart from './components/MonthlyExpensesChart';
import CategoryPieChart from './components/CategoryPieChart';
import DashboardCards from './components/DashboardCards';

export default function Home() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  return (
    <main className="p-6 max-w-[1600px] mx-auto space-y-10">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          💸 Personal Finance Visualizer
        </h1>
        <p className="text-gray-500 text-sm">
          Track your transactions and visualize spending over time.
        </p>
      </header>

      {/* Top Row: Dashboard + Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <DashboardCards refreshFlag={refreshFlag} />
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <TransactionForm onSuccess={triggerRefresh} />
        </div>
      </div>

      {/* Middle Row: Transaction List */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <TransactionList refreshFlag={refreshFlag} onUpdateSuccess={triggerRefresh} />
      </div>

      {/* Bottom Row: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <MonthlyExpensesChart refreshFlag={refreshFlag} />
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <CategoryPieChart refreshFlag={refreshFlag} />
        </div>
      </div>
    </main>
  );
}
