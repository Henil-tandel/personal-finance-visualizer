// /lib/models/budget.ts
import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema(
  {
    month: String, // format: "Jul 2025"
    amount: Number,
  },
  { timestamps: true }
);

// 💡 Fix: clear Mongoose model cache during development
const modelName = 'Budget';
if (mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

const Budget = mongoose.model(modelName, BudgetSchema);

export default Budget;
