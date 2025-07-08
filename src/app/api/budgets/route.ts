// /app/api/budgets/route.ts
import { connectDB } from '@/lib/db';
import Budget from '@/lib/models/budget';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await connectDB();
  const month = req.nextUrl.searchParams.get('month');

  // If specific month provided → return one budget
  if (month) {
    const budget = await Budget.findOne({ month });
    return NextResponse.json(budget || {});
  }

  // Otherwise → return all budgets
  const allBudgets = await Budget.find().sort({ month: -1 }).lean();
  return NextResponse.json(allBudgets); // returns array
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { month, amount } = body;

  if (!month || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Update if exists
  const existing = await Budget.findOne({ month });

  if (existing) {
    existing.amount = amount;
    await existing.save();
    return NextResponse.json(existing);
  }

  // Create new
  const newBudget = await Budget.create({ month, amount });
  return NextResponse.json(newBudget);
}
