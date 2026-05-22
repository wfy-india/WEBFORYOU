import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

// GET /api/client?passkey=xxx - verify passkey and get project data
// GET /api/client?passkey=xxx&milestones=true - get milestones
// GET /api/client?passkey=xxx&requests=true - get maintenance requests
export async function GET(req: NextRequest) {
  const passkey = req.nextUrl.searchParams.get('passkey');
  if (!passkey) {
    return NextResponse.json({ error: 'Passkey required' }, { status: 400 });
  }

  // Fetch project by passkey (case-sensitive by default in Postgres)
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('passkey', passkey)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: 'Invalid passkey' }, { status: 401 });
  }

  const milestones = req.nextUrl.searchParams.get('milestones');
  if (milestones === 'true') {
    const { data, error } = await supabaseAdmin
      .from('milestones')
      .select('*')
      .eq('project_id', project.id)
      .order('order', { ascending: true });

    return NextResponse.json({ milestones: data || [] });
  }

  const requests = req.nextUrl.searchParams.get('requests');
  if (requests === 'true') {
    const { data, error } = await supabaseAdmin
      .from('maintenance_requests')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ requests: data || [] });
  }

  // Return project (without passkey in response for security)
  const { passkey: _, ...safeProject } = project;
  return NextResponse.json({ project: safeProject });
}

// POST /api/client - submit maintenance request
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { passkey, message, attachments } = body;

  if (!passkey || !message) {
    return NextResponse.json({ error: 'Passkey and message required' }, { status: 400 });
  }

  // Verify passkey
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('passkey', passkey)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: 'Invalid passkey' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('maintenance_requests')
    .insert({
      project_id: project.id,
      message: message.trim(),
      attachments: attachments || [],
      status: 'pending'
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ request: data[0] });
}
