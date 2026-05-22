import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      project_id,
      amount_paid_paise,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET is not configured');
      return NextResponse.json(
        { error: 'Payment verification configuration error' },
        { status: 500 }
      );
    }

    // Generate expected signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Compare signatures
    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      // Signature mismatch — do NOT mark as paid
      return NextResponse.json(
        { verified: false, error: 'Payment verification failed — signature mismatch' },
        { status: 400 }
      );
    }

    // Payment verified — update amount_paid in the database
    if (project_id && amount_paid_paise) {
      const amountInRupees = Number(amount_paid_paise) / 100;

      // Fetch current amount_paid for the project
      const { data: project, error: fetchError } = await supabaseAdmin
        .from('projects')
        .select('amount_paid, investment_cost')
        .eq('id', project_id)
        .single();

      if (fetchError) {
        console.error('Failed to fetch project for payment update:', fetchError);
      } else if (project) {
        const currentPaid = Number(project.amount_paid) || 0;
        const newAmountPaid = currentPaid + amountInRupees;

        const { error: updateError } = await supabaseAdmin
          .from('projects')
          .update({ amount_paid: newAmountPaid })
          .eq('id', project_id);

        if (updateError) {
          console.error('Failed to update payment in database:', updateError);
          // Still return verified since payment went through — log for manual reconciliation
        }
      }
    }

    return NextResponse.json({
      verified: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
