import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate amount (minimum 100 paise = ₹1)
    if (!amount || typeof amount !== 'number' || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (₹1)' },
        { status: 400 }
      );
    }

    const options = {
      amount, // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: unknown) {
    console.error('Razorpay create order error:', JSON.stringify(error, Object.getOwnPropertyNames(error as object), 2));

    const errObj = error as Record<string, unknown>;

    // Handle Razorpay auth failures
    if (errObj?.statusCode === 401) {
      return NextResponse.json(
        { error: 'Payment gateway authentication failed' },
        { status: 401 }
      );
    }

    // Extract Razorpay error details if available
    const razorpayError = errObj?.error as Record<string, unknown> | undefined;
    const errorDescription = razorpayError?.description || errObj?.message || 'Failed to create payment order';

    return NextResponse.json(
      { error: errorDescription },
      { status: 500 }
    );
  }
}
