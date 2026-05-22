import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, business_name, mobile_number, plan_name } = body;

  if (!name || !business_name || !mobile_number || !plan_name) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('plan_requests')
    .insert([{ name, business_name, mobile_number, plan_name }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
