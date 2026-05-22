import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const projectId = formData.get('project_id') as string;

  if (!file || !projectId) {
    return NextResponse.json({ error: 'File and project_id required' }, { status: 400 });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from('maintenance-attachments')
    .upload(fileName, buffer, {
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrl } = supabaseAdmin.storage
    .from('maintenance-attachments')
    .getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl.publicUrl });
}
