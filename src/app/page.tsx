'use client';

import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import MonthlyExpensesChart from './components/MonthlyExpensesChart';
import CategoryPieChart from './components/CategoryPieChart';
import DashboardCards from './components/DashboardCards';
import BudgetForm from './components/BudgetForm';
import BudgetList from './components/BudgetList';
import BudgetComparisonChart from './components/BudgetComparisonChart';
import SpendingInsights from './components/SpendingInsights';

export default function Home() {
  const [refreshFlag, setRefreshFlag] = useState(false);
  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  return (
    <main className="px-4 py-6 sm:p-6 max-w-[1600px] mx-auto space-y-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">💸 Personal Finance Visualizer</h1>
        <p className="text-gray-500 text-sm">
          Track your transactions and visualize your spending insights.
        </p>
      </header>

      {/* Dashboard Overview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">📊 Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <DashboardCards refreshFlag={refreshFlag} />
          </div>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <TransactionForm onSuccess={triggerRefresh} />
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">📄 Transactions</h2>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <TransactionList refreshFlag={refreshFlag} onUpdateSuccess={triggerRefresh} />
        </div>
      </section>

      {/* Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">📈 Visual Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <MonthlyExpensesChart refreshFlag={refreshFlag} />
          </div>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <CategoryPieChart refreshFlag={refreshFlag} />
          </div>
        </div>
      </section>

      {/* Budget Management */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">💰 Budget Manager</h2>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <BudgetForm onSuccess={triggerRefresh} />
        </div>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <BudgetList refreshFlag={refreshFlag} />
        </div>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <BudgetComparisonChart refreshFlag={refreshFlag} />
        </div>
      </section>

      {/* Smart Insights */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">🧠 Smart Spending Insights</h2>
        <div className="bg-white shadow-sm rounded-lg p-6">
          <SpendingInsights refreshFlag={refreshFlag} />
        </div>
      </section>
    </main>
  );
}
