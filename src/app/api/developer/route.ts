import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

function verifyDevAuth(req: NextRequest): boolean {
  const auth = req.headers.get('x-dev-auth');
  return !!auth && auth === process.env.DEV_PASSWORD;
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action');

  // Public endpoint — no auth required
  if (action === 'billing') {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('id, business_name, client_name, investment_cost, amount_paid, status')
      .order('business_name', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ projects: data || [] });
  }

  if (!verifyDevAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (action === 'projects') {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ projects: data || [] });
  }

  if (action === 'milestones') {
    const projectId = req.nextUrl.searchParams.get('project_id');
    if (!projectId) return NextResponse.json({ error: 'project_id required' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ milestones: data || [] });
  }

  if (action === 'requests') {
    const { data, error } = await supabaseAdmin
      .from('maintenance_requests')
      .select('*, project:projects(*)')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ requests: data || [] });
  }

  if (action === 'contacts') {
    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ contacts: data || [] });
  }

  if (action === 'plan_requests') {
    const { data, error } = await supabaseAdmin
      .from('plan_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ plan_requests: data || [] });
  }

  if (action === 'chatbot_tickets') {
    const { data, error } = await supabaseAdmin
      .from('chatbot_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    // In case the table doesn't exist yet, just return an empty array gracefully
    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ chatbot_tickets: [] });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ chatbot_tickets: data || [] });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === 'create_ticket') {
    // This is called by the Chatbot widget to escalate to a ticket
    // No auth needed for this action as it comes from the public website
    const { name, mobile, user_query, ai_response } = body;
    const { data, error } = await supabaseAdmin
      .from('chatbot_tickets')
      .insert([{ name, mobile, user_query, ai_response, status: 'new' }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ticket: data[0] });
  }

  if (!verifyDevAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (action === 'create_project') {
    const { project } = body;
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([project])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ project: data[0] });
  }

  if (action === 'add_milestone') {
    const { milestone } = body;
    const { data, error } = await supabaseAdmin
      .from('milestones')
      .insert([milestone])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ milestone: data[0] });
  }



  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function PUT(req: NextRequest) {
  if (!verifyDevAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  if (action === 'update_project_status') {
    const { projectId, status } = body;
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ status })
      .eq('id', projectId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'update_payment') {
    const { projectId, investment_cost, amount_paid } = body;
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ investment_cost, amount_paid })
      .eq('id', projectId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'update_milestone') {
    const { milestoneId, updates } = body;
    const { data, error } = await supabaseAdmin
      .from('milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ milestone: data[0] });
  }

  if (action === 'update_request_status') {
    const { requestId, status } = body;
    const { error } = await supabaseAdmin
      .from('maintenance_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'update_chatbot_ticket') {
    const { ticketId, status } = body;
    const { error } = await supabaseAdmin
      .from('chatbot_tickets')
      .update({ status })
      .eq('id', ticketId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  if (!verifyDevAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const action = req.nextUrl.searchParams.get('action');
  const id = req.nextUrl.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  if (action === 'project') {
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === 'milestone') {
    const { error } = await supabaseAdmin.from('milestones').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
