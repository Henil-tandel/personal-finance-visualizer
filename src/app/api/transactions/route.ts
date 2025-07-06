// app/api/transactions/route.ts
import { connectDB } from '@/lib/db';
import Transaction from '@/lib/models/transaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const data = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { amount, description, date, category } = body;

  if (!amount || !description || !date || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const newTransaction = await Transaction.create({ amount, description, date, category });
  return NextResponse.json(newTransaction);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { id, amount, description, date, category } = body;

  if (!id || !amount || !description || !date || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const updated = await Transaction.findByIdAndUpdate(
    id,
    { amount, description, date, category },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
